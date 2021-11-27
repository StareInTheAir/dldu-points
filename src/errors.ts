function buildMessage (message: string, err: unknown): string {
  return `${message}: ${JSON.stringify(err)}`
}

class JsonValidationFailedError extends Error {
  constructor (message: string, err: unknown) {
    super(buildMessage(message, err))
    this.name = 'JsonValidationFailedError'
  }
}

class JsonParsingFailedError extends Error {
  constructor (message: string, err: unknown) {
    super(buildMessage(message, err))
    this.name = 'JsonParsingFailedError'
  }
}

class FetchFailedError extends Error {
  constructor (message: string, err: unknown) {
    super(buildMessage(message, err))
    this.name = 'FetchFailedError'
  }
}

class FetchStatusError extends Error {
  constructor (message: string, status: number) {
    super(buildMessage(message, status))
    this.name = 'FetchStatusError'
  }
}

class UnauthorizedError extends FetchStatusError {
  constructor (message: string) {
    super(message, 401)
    this.name = 'UnauthorizedError'
  }
}

class ForbiddenError extends FetchStatusError {
  constructor (message: string) {
    super(message, 403)
    this.name = 'ForbiddenError'
  }
}

class RefreshTokenInvalidError extends Error {
  constructor () {
    super()
    this.name = 'RefreshTokenInvalidError'
  }
}

export {
  JsonValidationFailedError,
  JsonParsingFailedError,
  FetchFailedError,
  FetchStatusError,
  UnauthorizedError,
  ForbiddenError,
  RefreshTokenInvalidError
}
