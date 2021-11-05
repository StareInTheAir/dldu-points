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

export { getAccessToken, clearAccessToken }
