import { clearAccessToken } from './auth'
import { DarkSoulsBoss, DarkSoulsLevel, DlduData } from './types'
import { getSheetsApiUrl } from './urls'
import { GoogleSheetsDlduData, validateGoogleSheetsDlduData } from './validate'

async function getDlduData (accessToken: string): Promise<DlduData> {
  try {
    const response = await fetch(getSheetsApiUrl(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    const status = response.status
    if (status >= 200 && status < 300) {
      try {
        const json = await response.json()
        if (validateGoogleSheetsDlduData(json)) {
          return googleDataToDlduData(json)
        } else {
          throw Error(`sheets JSON invalid: ${validateGoogleSheetsDlduData.errors}`)
        }
      } catch (err) {
        throw Error(`sheets JSON parsing failed ${err}`)
      }
    } else if (status === 401) {
      clearAccessToken()
      throw Error('Access token expired')
    } else {
      throw Error(`sheets fetch status code not OK: ${status}`)
    }
  } catch (err) {
    throw Error(`sheets fetch failed: ${err}`)
  }
}

function googleDataToDlduData (googleData: GoogleSheetsDlduData): DlduData {
  const levels: DarkSoulsLevel[] = []

  for (const sheet of googleData.sheets) {
    const levelName = sheet.properties.title.trim()
    const bosses: DarkSoulsBoss[] = []
    const rowData = sheet.data[0]?.rowData
    if (rowData) {
      for (const row of rowData) {
        if (row.values.length >= 3 && row.values[0].formattedValue &&
            row.values[1].formattedValue && row.values[2].formattedValue) {
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
