import { DarkSoulsBoss, DarkSoulsLevel, DlduData } from './types'
import { GoogleSheetsDlduData, validateGoogleSheetsDlduData } from './validate'

const SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets/1EmdjUnFUYcLUz9XH9EfNmb9jGomW6w955NElJqGeosI?fields=sheets/properties/title,sheets/data/rowData/values/formattedValue'

async function getDlduData (accessToken: string): Promise<DlduData> {
  const response = await fetch(SHEETS_API_URL, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  const status = response.status
  if (status >= 200 && status < 300) {
    const json = await response.json()
    if (validateGoogleSheetsDlduData(json)) {
      return googleDataToDlduData(json)
    } else {
      throw Error('TODO')
    }
  } else {
    throw Error(`fetch status code not OK: ${status}`)
  }
}

function googleDataToDlduData (googleData: GoogleSheetsDlduData): DlduData {
  const levels: DarkSoulsLevel[] = []

  for (const sheet of googleData.sheets) {
    const levelName = sheet.properties.title.trim()
    const bosses: DarkSoulsBoss[] = []
    for (const row of sheet.data[0].rowData) {
      const name = row.values[0].formattedValue.trim()
      const points = parseInt(row.values[1].formattedValue)
      const beaten = row.values[2].formattedValue !== 'n'
      if (name.length > 0 && !isNaN(points)) {
        bosses.push({ name, points, beaten })
      }
    }
    if (levelName.length > 0 && bosses.length > 0) {
      levels.push({ name: levelName, bosses })
    }
  }

  return { levels }
}

export { getDlduData }
