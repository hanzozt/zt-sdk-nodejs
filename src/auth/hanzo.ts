/**
 * Hanzo IAM authentication for the ZT controller.
 *
 * Resolves JWT credentials from:
 * 1. HANZO_API_KEY environment variable
 * 2. ~/.hanzo/auth.json file
 */

import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

export interface HanzoCredentials {
  token: string
  email?: string
}

/**
 * Resolve Hanzo IAM credentials from environment or auth file.
 * @throws Error if no credentials are found
 */
export function resolve(): HanzoCredentials {
  // 1. Check HANZO_API_KEY env
  const apiKey = process.env.HANZO_API_KEY
  if (apiKey) {
    return { token: apiKey }
  }

  // 2. Check auth file
  const authPath = path.join(os.homedir(), '.hanzo', 'auth.json')
  if (fs.existsSync(authPath)) {
    const raw = fs.readFileSync(authPath, 'utf8')
    const auth = JSON.parse(raw)
    const token = auth.token || auth.api_key
    if (token) {
      return { token, email: auth.email }
    }
  }

  throw new Error(
    'No Hanzo credentials found — set HANZO_API_KEY or run `dev login`'
  )
}

/**
 * Create credentials from an explicit token.
 */
export function fromToken(token: string): HanzoCredentials {
  return { token }
}

/**
 * Create an Authorization header value from credentials.
 */
export function authHeader(creds: HanzoCredentials): string {
  return `Bearer ${creds.token}`
}

/**
 * Human-readable credential display string.
 */
export function display(creds: HanzoCredentials): string {
  if (creds.email) {
    return `Hanzo IAM (${creds.email})`
  }
  if (creds.token.length > 8) {
    return `Hanzo API key (...${creds.token.slice(-5)})`
  }
  return 'Hanzo API key (***)'
}

/**
 * Authenticate with a ZT controller using Hanzo IAM JWT.
 * Uses the external JWT auth method.
 */
export async function authenticateController(
  controllerUrl: string,
  creds: HanzoCredentials
): Promise<{ token: string; identity: any }> {
  const url = `${controllerUrl.replace(/\/+$/, '')}/edge/client/v1/authenticate?method=ext-jwt`

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader(creds),
    },
    body: JSON.stringify({ configTypes: [] }),
  })

  if (!resp.ok) {
    const text = await resp.text()
    throw new Error(`ZT auth failed (${resp.status}): ${text}`)
  }

  const envelope = await resp.json() as any
  return {
    token: envelope.data.token,
    identity: envelope.data.identity,
  }
}
