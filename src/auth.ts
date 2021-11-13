import { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } from './auth-data'
import { AccessToken } from './types'
import { getAccessTokenUrl } from './urls'
import { validateGoogleAccessToken } from './validate'

let lastAccessToken: AccessToken | undefined

async function getAccessToken (): Promise<AccessToken> {
  if (!lastAccessToken || lastAccessToken.validUntil < Date.now()) {
    lastAccessToken = await getNewAccessToken()
  }
  return lastAccessToken
}

function clearAccessToken (): void {
  lastAccessToken = undefined
}

async function getNewAccessToken (): Promise<AccessToken> {
  const request = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: encodeToForm({
      refresh_token: REFRESH_TOKEN,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'refresh_token'
    })
  }
  try {
    const response = await fetch(getAccessTokenUrl(), request)
    const status = response.status
    if (status >= 200 && status < 300) {
      try {
        const json = await response.json()
        if (validateGoogleAccessToken(json)) {
          return {
            token: json.access_token,
            validUntil: Date.now() + json.expires_in * 1000 - 60_000
          }
        } else {
          throw Error(`getAccessToken JSON invalid: ${validateGoogleAccessToken.errors}`)
        }
      } catch (err) {
        throw Error(`getAccessToken JSON parsing failed: ${err}`)
      }
    } else {
      throw Error(`getAccessToken fetch status code not OK: ${status}`)
    }
  } catch (err) {
    throw Error(`getAccessToken fetch failed: ${err}`)
  }
}

function encodeToForm (data: {[key: string]: string}): string {
  const formData = []
  for (const key in data) {
    const encodedKey = encodeURIComponent(key)
    const encodedValue = encodeURIComponent(data[key])
    formData.push(encodedKey + '=' + encodedValue)
  }
  return formData.join('&')
}

async function getAuthDataHash (): Promise<string> {
  const textEncoder = new TextEncoder()
  const clientIdBytes = textEncoder.encode(CLIENT_ID)
  const clientSecretBytes = textEncoder.encode(CLIENT_SECRET)
  const refershTokenBytes = textEncoder.encode(REFRESH_TOKEN)

  const clientIdHash = await crypto.subtle.digest('SHA-256', clientIdBytes)
  const clientSecretHash = await crypto.subtle.digest('SHA-256', clientSecretBytes)
  const refershTokenHash = await crypto.subtle.digest('SHA-256', refershTokenBytes)

  const clientIdHex = bufferToHex(clientIdHash.slice(0, 1))
  const clientSecretHex = bufferToHex(clientSecretHash.slice(0, 1))
  const refershTokenHex = bufferToHex(refershTokenHash.slice(0, 1))

  return `${clientIdHex}${clientSecretHex}${refershTokenHex}`
}

function bufferToHex (buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export { getAccessToken, clearAccessToken, getAuthDataHash }
