import { getSheetId } from './query-params'

function getSheetsApiUrl (): string {
  return `https://sheets.googleapis.com/v4/spreadsheets/${getSheetId()}?fields=sheets/properties/title,sheets/data/rowData/values/formattedValue`
}

function getAccessTokenUrl (): string {
  return 'https://oauth2.googleapis.com/token'
}

export { getSheetsApiUrl, getAccessTokenUrl }
