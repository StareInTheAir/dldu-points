import Ajv, { JTDSchemaType } from 'ajv/dist/jtd'
const ajv = new Ajv()

interface GoogleAccessToken {
  'access_token': string
  'expires_in': number,
  'scope': 'https://www.googleapis.com/auth/spreadsheets.readonly'
  'token_type': 'Bearer'
}

const accessGoogleAccessToken: JTDSchemaType<GoogleAccessToken> = {
  properties: {
    expires_in: { type: 'uint32' },
    access_token: { type: 'string' },
    scope: { enum: ['https://www.googleapis.com/auth/spreadsheets.readonly'] },
    token_type: { enum: ['Bearer'] }
  }
}

const validateGoogleAccessToken = ajv.compile<GoogleAccessToken>(accessGoogleAccessToken)

interface GoogleSheetsDlduData {
  sheets: {
    properties: {
      title: string
    }
    data: {
      rowData: {
        values: {
          formattedValue: string
        }[]
      }[]
    }[]
  }[]
}

const googleSheetsDlduDataSchema: JTDSchemaType<GoogleSheetsDlduData> = {
  properties: {
    sheets: {
      elements: {
        properties: {
          properties: {
            properties: {
              title: {
                type: 'string'
              }
            }
          },
          data: {
            elements: {
              properties: {
                rowData: {
                  elements: {
                    properties: {
                      values: {
                        elements: {
                          properties: {
                            formattedValue: {
                              type: 'string'
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

const validateGoogleSheetsDlduData = ajv.compile<GoogleSheetsDlduData>(googleSheetsDlduDataSchema)

export {
  GoogleAccessToken, validateGoogleAccessToken,
  GoogleSheetsDlduData, validateGoogleSheetsDlduData
}
