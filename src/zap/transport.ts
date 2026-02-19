/**
 * ZAP Transport over ZT connections.
 *
 * Wraps native ZT connections with ZAP framing (4-byte length prefix + Cap'n Proto)
 * and registers the `zt://` URL scheme with the ZAP client.
 */

import { EventEmitter } from 'events'

/** Maximum message size: 16 MB */
const MAX_MESSAGE_SIZE = 16 * 1024 * 1024

/** 4-byte big-endian length prefix */
function encodeLength(length: number): Buffer {
  const buf = Buffer.alloc(4)
  buf.writeUInt32BE(length, 0)
  return buf
}

function decodeLength(buf: Buffer): number {
  return buf.readUInt32BE(0)
}

export interface ZtTransportOptions {
  /** ZT service name to connect to */
  service: string
  /** Optional connection timeout in milliseconds */
  timeout?: number
}

/**
 * ZAP transport that routes messages through the ZT fabric.
 *
 * Usage:
 * ```ts
 * const transport = new ZtTransport({ service: 'my-service' })
 * await transport.connect(ztConnection)
 * await transport.send(Buffer.from('hello'))
 * const data = await transport.recv()
 * ```
 */
export class ZtTransport extends EventEmitter {
  private connection: any | null = null
  private service: string
  private connected = false
  private readBuffer: Buffer = Buffer.alloc(0)
  private timeout: number

  constructor(options: ZtTransportOptions) {
    super()
    this.service = options.service
    this.timeout = options.timeout ?? 30000
  }

  /** Connect to a ZT service using an existing ZT socket/connection */
  async connect(ztConnection: any): Promise<void> {
    this.connection = ztConnection
    this.connected = true
    this.emit('connected', { service: this.service })
  }

  /** Send a length-prefixed message */
  async send(data: Buffer | Uint8Array): Promise<void> {
    if (!this.connected || !this.connection) {
      throw new Error('ZT transport not connected')
    }

    const buf = Buffer.isBuffer(data) ? data : Buffer.from(data)
    if (buf.length > MAX_MESSAGE_SIZE) {
      throw new Error(`Message too large: ${buf.length} bytes (max: ${MAX_MESSAGE_SIZE})`)
    }

    const frame = Buffer.concat([encodeLength(buf.length), buf])

    return new Promise((resolve, reject) => {
      if (this.connection.write) {
        this.connection.write(frame, (err: Error | null) => {
          if (err) reject(err)
          else resolve()
        })
      } else if (this.connection.send) {
        this.connection.send(frame)
        resolve()
      } else {
        reject(new Error('ZT connection has no write/send method'))
      }
    })
  }

  /** Receive a length-prefixed message */
  async recv(): Promise<Buffer> {
    if (!this.connected || !this.connection) {
      throw new Error('ZT transport not connected')
    }

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`recv timeout after ${this.timeout}ms`))
      }, this.timeout)

      const onData = (chunk: Buffer) => {
        this.readBuffer = Buffer.concat([this.readBuffer, chunk])

        // Need at least 4 bytes for length header
        if (this.readBuffer.length < 4) return

        const length = decodeLength(this.readBuffer)
        if (length > MAX_MESSAGE_SIZE) {
          clearTimeout(timer)
          this.connection?.removeListener?.('data', onData)
          reject(new Error(`Message too large: ${length} bytes`))
          return
        }

        // Wait for full message
        if (this.readBuffer.length < 4 + length) return

        const message = this.readBuffer.subarray(4, 4 + length)
        this.readBuffer = this.readBuffer.subarray(4 + length)

        clearTimeout(timer)
        this.connection?.removeListener?.('data', onData)
        resolve(Buffer.from(message))
      }

      if (this.connection.on) {
        this.connection.on('data', onData)
      } else {
        clearTimeout(timer)
        reject(new Error('ZT connection has no event listener support'))
      }
    })
  }

  /** Close the transport */
  async close(): Promise<void> {
    this.connected = false
    if (this.connection) {
      if (this.connection.close) {
        this.connection.close()
      } else if (this.connection.destroy) {
        this.connection.destroy()
      }
      this.connection = null
    }
    this.emit('closed')
  }

  /** Check if connected */
  isConnected(): boolean {
    return this.connected
  }

  /** Get the service name */
  serviceName(): string {
    return this.service
  }

  /** Get local address */
  localAddr(): string | null {
    return this.connected ? `zt://local/${this.service}` : null
  }

  /** Get peer address */
  peerAddr(): string | null {
    return this.connected ? `zt://${this.service}` : null
  }
}

/**
 * Parse a zt:// URL into a service name.
 * Format: zt://service-name
 */
export function parseZtUrl(url: string): string {
  if (!url.startsWith('zt://')) {
    throw new Error(`Invalid ZT URL: ${url} (must start with zt://)`)
  }
  return url.slice(5)
}

export default ZtTransport
