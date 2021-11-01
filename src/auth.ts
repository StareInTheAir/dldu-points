import { AccessToken } from './types'
import { validateGoogleAccessToken } from './validate'

const GET_ACCESS_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const REFRESH_TOKEN = '1//09vKIKaUu6YQVCgYIARAAGAkSNwF-L9IrFxj_7Hcpr06BfV9Eawm7K4m1y8sM3K3mNxqcRzrLZZ2dnNb0bMrKNtpmuqvV-9COQBo'
const CLIENT_ID = '162293629626-nsvuae4kf8d2dldb789ved4d39gg22ls.apps.googleusercontent.com'
const CLIENT_SECRET = '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'

let lastAccessToken: AccessToken | undefined

async function getAccessToken (): Promise<AccessToken> {
  if (!lastAccessToken || lastAccessToken.validUntil < Date.now()) {
    lastAccessToken = await getNewAccessToken()
  }
  return lastAccessToken
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
    const response = await fetch(GET_ACCESS_TOKEN_URL, request)
    const status = response.status
    if (status >= 200 && status < 300) {
      try {
        const json = await response.json()
        if (validateGoogleAccessToken(json)) {
          return {
            token: json.access_token,
            validUntil: Date.now() + json.expires_in - 60
          }
        } else {
          throw Error(`Access token format valid: ${validateGoogleAccessToken.errors}`)
        }
      } catch (err) {
        throw Error(`JSON parsing failed: ${err}`)
      }
    } else {
      throw Error(`fetch status code not OK: ${status}`)
    }
  } catch (err) {
    throw Error(`fetch failed: ${err}`)
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

export { getAccessToken }
