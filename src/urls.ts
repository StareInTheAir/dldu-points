import { getSheetId } from './query-params'

function getSheetsApiUrl (): string {
  return `https://sheets.googleapis.com/v4/spreadsheets/${getSheetId()}/values/Points?key=${API_KEY}`
}

export { getSheetsApiUrl }
