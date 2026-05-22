import { io, type Socket } from 'socket.io-client'

type WidgetConfig = {
  agentId: string
  tenantId: string
  apiUrl?: string
  position?: 'bottom-right' | 'bottom-left'
  color?: string
}

type IncomingMessage = {
  conversationId: string
  message: {
    id: string
    role: string
    content: string
    createdAt: string
  }
}

class SmartCSWidget {
  private config: Required<WidgetConfig>
  private socket: Socket | null = null
  private conversationId: string | null = null
  private anonymousId: string

  constructor(config: WidgetConfig) {
    this.config = {
      apiUrl: 'http://localhost:4000',
      position: 'bottom-right',
      color: '#6366f1',
      ...config,
    }
    this.anonymousId = this.getOrCreateAnonymousId()
    this.mount()
  }

  private getOrCreateAnonymousId(): string {
    const stored = localStorage.getItem('scs_anon_id')
    if (stored) return stored
    const id = crypto.randomUUID()
    localStorage.setItem('scs_anon_id', id)
    return id
  }

  private mount(): void {
    // TODO: render chat bubble + window UI
    this.connect()
  }

  private connect(): void {
    this.socket = io(`${this.config.apiUrl}/widget`, {
      transports: ['websocket'],
      auth: {
        agentId: this.config.agentId,
        tenantId: this.config.tenantId,
        anonymousId: this.anonymousId,
      },
    })

    this.socket.on('connect', () => {
      this.socket?.emit('widget:init', {
        agentId: this.config.agentId,
        anonymousId: this.anonymousId,
      })
    })

    this.socket.on('widget:message', (event: IncomingMessage) => {
      this.conversationId = event.conversationId
      this.onMessage(event.message.content, event.message.role)
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onMessage(_content: string, _role: string): void {
    // TODO: render message in chat window
  }

  sendMessage(content: string): void {
    if (!this.socket?.connected) return
    this.socket.emit('widget:message', {
      conversationId: this.conversationId ?? undefined,
      content,
      contentType: 'text',
    })
  }
}

declare global {
  interface Window {
    SmartCS: { init: (config: WidgetConfig) => SmartCSWidget }
  }
}

window.SmartCS = {
  init: (config: WidgetConfig) => new SmartCSWidget(config),
}
