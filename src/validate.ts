/* eslint-disable @stylistic/quote-props */
import Ajv, { type JTDSchemaType } from 'ajv/dist/jtd'
const ajv = new Ajv()

interface GoogleSheetsDlduData {
  range: string
  majorDimension: string
  values: string[][]
}

const googleSheetsDlduDataSchema: JTDSchemaType<GoogleSheetsDlduData> = {
  properties: {
    'range': {
      type: 'string'
    },
    'majorDimension': {
      type: 'string'
    },
    'values': {
      elements: {
        elements: {
          type: 'string'
        }
      }
    }
  }
}

const validateGoogleSheetsDlduData = ajv.compile<GoogleSheetsDlduData>(googleSheetsDlduDataSchema)

export type { GoogleSheetsDlduData }
export { validateGoogleSheetsDlduData }
