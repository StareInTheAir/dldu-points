import { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } from './auth-data'
import { FetchFailedError, FetchStatusError, JsonParsingFailedError, JsonValidationFailedError, RefreshTokenInvalidError } from './errors'
import { Token } from './types'
import { getAccessTokenUrl } from './urls'
import { validateGoogleAccessToken } from './validate'

let lastAccessToken: Token | undefined

async function getAccessToken (): Promise<Token> {
  if ((lastAccessToken == null) || lastAccessToken.validUntil < Date.now()) {
    lastAccessToken = await getNewAccessToken()
  }
  return lastAccessToken
}

function clearAccessToken (): void {
  lastAccessToken = undefined
}

async function getNewAccessToken (): Promise<Token> {
  if (REFRESH_TOKEN.validUntil < Date.now()) {
    throw new RefreshTokenInvalidError()
  }

  const request = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: encodeToForm({
      refresh_token: REFRESH_TOKEN.token,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'refresh_token'
    })
  }
  let response: Response
  try {
    response = await fetch(getAccessTokenUrl(), request)
  } catch (err) {
    throw new FetchFailedError('auth', err)
  }

  const status = response.status
  if (status < 200 || status >= 300) {
    throw new FetchStatusError('auth', status)
  }

  let json
  try {
    json = await response.json()
  } catch (err) {
    throw new JsonParsingFailedError('auth', err)
  }

  if (validateGoogleAccessToken(json)) {
    return {
      token: json.access_token,
      validUntil: Date.now() + json.expires_in * 1000 - 60_000
    }
  } else {
    throw new JsonValidationFailedError('auth', validateGoogleAccessToken.errors)
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
  const refershTokenBytes = textEncoder.encode(REFRESH_TOKEN.token)

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
