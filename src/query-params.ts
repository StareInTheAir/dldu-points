const urlParams = new URLSearchParams(window.location.search)

function getSheetIdInternal (): string | null {
  return urlParams.get('sheetId')
}

function isSheetIdSuppliedAndValid (): boolean {
  const sheetId = getSheetIdInternal()
  if (sheetId != null) {
    return sheetId.match(/^[0-9a-zA-Z-_]+$/) !== null
  }
  return false
}

function getSheetId (): string {
  const sheetId = getSheetIdInternal()
  if (sheetId != null) {
    return sheetId.trim()
  }
  throw Error('sheetId query parameter is missing')
}

function getIntParam (key: string): number | undefined {
  const param = urlParams.get(key)
  if (param != null) {
    const numParam = parseInt(param)
    if (!isNaN(numParam)) {
      return numParam
    }
  }
  return undefined
}

function getSecondsPerPage (): number | undefined {
  return getIntParam('secondsPerPage')
}

export { isSheetIdSuppliedAndValid, getSheetId, getSecondsPerPage }
