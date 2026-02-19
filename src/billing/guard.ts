/**
 * Billing enforcement for ZT services.
 * No free tier — every service access requires a positive balance.
 */

export interface BillingConfig {
  /** Commerce API URL */
  commerceUrl?: string
  /** Auth token for API calls */
  authToken: string
}

export interface UsageRecord {
  service: string
  sessionId: string
  bytesSent: number
  bytesReceived: number
  durationMs: number
}

/** Error thrown when user has insufficient balance */
export class InsufficientBalanceError extends Error {
  service: string
  balance: number

  constructor(service: string, balance: number) {
    super(
      `Insufficient balance for service '${service}' (current: ${balance.toFixed(2)}) — no free tier available`
    )
    this.name = 'InsufficientBalanceError'
    this.service = service
    this.balance = balance
  }
}

/**
 * Billing guard that checks balance before allowing service access.
 */
export class BillingGuard {
  private commerceUrl: string
  private authToken: string

  constructor(config: BillingConfig) {
    this.commerceUrl = (config.commerceUrl ?? 'https://api.hanzo.ai/commerce').replace(/\/+$/, '')
    this.authToken = config.authToken
  }

  /**
   * Check that the user has sufficient balance for the service.
   * @throws InsufficientBalanceError if balance <= 0
   */
  async checkBalance(service: string): Promise<void> {
    const url = `${this.commerceUrl}/v1/billing/balance?service=${encodeURIComponent(service)}`

    const resp = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
      },
    })

    if (!resp.ok) {
      const text = await resp.text()
      throw new Error(`Billing check failed (${resp.status}): ${text}`)
    }

    const result = await resp.json() as { balance: number; currency?: string }

    if (result.balance <= 0) {
      throw new InsufficientBalanceError(service, result.balance)
    }
  }

  /**
   * Record usage after a session ends.
   */
  async recordUsage(record: UsageRecord): Promise<void> {
    const url = `${this.commerceUrl}/v1/billing/usage`

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(record),
    })

    if (!resp.ok) {
      const text = await resp.text()
      console.warn(`Failed to record usage (${resp.status}): ${text}`)
    }
  }
}
