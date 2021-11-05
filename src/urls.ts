function getSheetIdInternal (): string | null {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('sheetId')
}

function isSheetIdSupplied (): boolean {
  const sheetId = getSheetIdInternal()
  if (sheetId) {
    return sheetId.trim().length > 0
  }
  return false
}

function getSheetId (): string {
  const sheetId = getSheetIdInternal()
  if (sheetId) {
    return sheetId.trim()
  }
  throw Error('sheetId query parameter is missing')
}

function getSheetsApiUrl (): string {
  return `https://sheets.googleapis.com/v4/spreadsheets/${getSheetId()}?fields=sheets/properties/title,sheets/data/rowData/values/formattedValue`
}

function getAccessTokenUrl (): string {
  return 'https://oauth2.googleapis.com/token'
}

export { getSheetsApiUrl, isSheetIdSupplied, getAccessTokenUrl }
