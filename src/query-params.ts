const urlParams = new URLSearchParams(window.location.search)

function getSheetIdInternal (): string | null {
  return urlParams.get('sheetId')
}

function isSheetIdSuppliedAndValid (): boolean {
  const sheetId = getSheetIdInternal()
  if (sheetId) {
    return sheetId.match(/^[0-9a-zA-Z]+$/) !== null
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

function isLeftSupplied (): boolean {
  return urlParams.has('left')
}

function getIntParam (key: string): number | undefined {
  const param = urlParams.get(key)
  if (param) {
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

function getZoom (): number | undefined {
  return getIntParam('zoom')
}

export { isSheetIdSuppliedAndValid, getSheetId, isLeftSupplied, getSecondsPerPage, getZoom }
