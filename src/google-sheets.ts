import { BadRequestError, FetchFailedError, FetchStatusError, ForbiddenError, JsonParsingFailedError, JsonValidationFailedError, UnauthorizedError } from './errors'
import { DarkSoulsBoss, DarkSoulsLevel, DlduData } from './types'
import { getSheetsApiUrl } from './urls'
import { GoogleSheetsDlduData, validateGoogleSheetsDlduData } from './validate'

async function getDlduData (): Promise<DlduData> {
  let response: Response
  try {
    response = await fetch(getSheetsApiUrl(), {
      method: 'GET'
    })
  } catch (err) {
    throw new FetchFailedError('sheets', err)
  }

  const status = response.status
  if (status === 400) {
    throw new BadRequestError('sheets')
  } else if (status === 401) {
    throw new UnauthorizedError('api key expired')
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
  if (googleData.majorDimension !== 'ROWS') {
    throw new JsonValidationFailedError('majorDimension must be ROWS', undefined)
  }

  const levels: DarkSoulsLevel[] = []

  for (const row of googleData.values) {
    const rowAsString = JSON.stringify(row)

    if (row.length === 0) {
      continue
    } else if (row.length < 4) {
      console.warn(`Ignoring incomplete row: ${rowAsString}`)
      continue
    }

    const type = row[0].trim()
    const name = row[1].trim()
    const points = parseInt(row[2].trim())
    const checked = row[3] === 'TRUE'

    if (type === 'level') {
      if (name.length === 0) {
        console.warn(`Ignoring nameless level: ${rowAsString}`)
      } else {
        levels.push({
          name,
          bosses: [],
          alwaysShowBosses: checked
        })
      }
    } else if (type === 'boss') {
      if (name.length === 0 || isNaN(points)) {
        console.warn(`Ignoring boss with invalid data: ${rowAsString}`)
      } else {
        if (levels.length === 0) {
          console.warn(`Ignoring boss without previous level: ${rowAsString}`)
        } else {
          const boss: DarkSoulsBoss = {
            name,
            points,
            beaten: checked
          }
          levels[levels.length - 1].bosses.push(boss)
        }
      }
    } else if (type !== 'Type') {
      console.warn(`Ignoring unexpected type in row ${rowAsString}`)
    }
  }

  const nonEmptyLevels = levels.filter(level => {
    if (level.bosses.length === 0) {
      console.warn(`Ignoring bossless level ${level.name}`)
      return false
    }
    return true
  })
  return { levels: nonEmptyLevels }
}

export { getDlduData }
