import { clearAccessToken } from './auth'
import { FetchFailedError, FetchStatusError, ForbiddenError, JsonParsingFailedError, JsonValidationFailedError, UnauthorizedError } from './errors'
import { DarkSoulsBoss, DarkSoulsLevel, DlduData } from './types'
import { getSheetsApiUrl } from './urls'
import { GoogleSheetsDlduData, validateGoogleSheetsDlduData } from './validate'

async function getDlduData (accessToken: string): Promise<DlduData> {
  let response: Response
  try {
    response = await fetch(getSheetsApiUrl(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  } catch (err) {
    throw new FetchFailedError('sheets', err)
  }

  const status = response.status
  if (status === 401) {
    clearAccessToken()
    throw new UnauthorizedError('sheets access token expired')
  } else if (status === 403) {
    throw new ForbiddenError('sheets')
  } else if (status < 200 || status >= 300) {
    throw new FetchStatusError('sheets', status)
  }

  let json
  try {
    json = await response.json()
  } catch (err) {
    throw new JsonParsingFailedError('sheets', err)
  }
  if (validateGoogleSheetsDlduData(json)) {
    return googleDataToDlduData(json)
  } else {
    throw new JsonValidationFailedError('sheets', validateGoogleSheetsDlduData.errors)
  }
}

function googleDataToDlduData (googleData: GoogleSheetsDlduData): DlduData {
  const levels: DarkSoulsLevel[] = []

  for (const sheet of googleData.sheets) {
    const levelName = sheet.properties.title.trim()
    const bosses: DarkSoulsBoss[] = []
    const rowData = sheet.data[0]?.rowData
    if (rowData != null) {
      for (const row of rowData) {
        if (row.values.length >= 3 &&
            row.values[0].formattedValue != null &&
            row.values[1].formattedValue != null &&
            row.values[2].formattedValue != null) {
          const name = row.values[0].formattedValue.trim()
          const points = parseInt(row.values[1].formattedValue.trim())
          const beaten = row.values[2].formattedValue === 'beaten'
          if (name.length > 0 && !isNaN(points)) {
            bosses.push({ name, points, beaten })
            continue
          }
        }
        console.log(`Ignoring boss ${JSON.stringify(row)} in level ${levelName}`)
      }
    }
    if (levelName.length > 0 && bosses.length > 0) {
      levels.push({ name: levelName, bosses })
    } else {
      console.log(`Ignoring empty level ${levelName}`)
    }
  }

  return { levels }
}

export { getDlduData }
