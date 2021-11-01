import Ajv, { JTDSchemaType } from 'ajv/dist/jtd'
const ajv = new Ajv()

interface AccessToken {
  'access_token': string
  'expires_in': number
}

const accessTokenSchema: JTDSchemaType<AccessToken> = {
  properties: {
    expires_in: { type: 'uint32' },
    access_token: { type: 'string' },
    scope: { enum: ['https://www.googleapis.com/auth/spreadsheets.readonly'] },
    token_type: { enum: ['Bearer'] }
  }
}

const validateAccessToken = ajv.compile(accessTokenSchema)

export { AccessToken, validateAccessToken }
