import { API_KEY } from './api-key'
import { getSheetId } from './query-params'

function getSheetsApiUrl (): string {
  return `https://sheets.googleapis.com/v4/spreadsheets/${getSheetId()}?key=${API_KEY}&fields=sheets/properties/title,sheets/data/rowData/values/formattedValue`
}

export { getSheetsApiUrl }
