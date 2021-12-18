/* eslint-disable quote-props */
import Ajv, { JTDSchemaType } from 'ajv/dist/jtd'
const ajv = new Ajv()

interface GoogleSheetsDlduData {
  sheets: Array<{
    properties: {
      title: string
    }
    data: Array<{
      rowData?: Array<{
        values: Array<{
          formattedValue?: string
        }>
      }>
    }>
  }>
}

const googleSheetsDlduDataSchema: JTDSchemaType<GoogleSheetsDlduData> = {
  properties: {
    'sheets': {
      elements: {
        properties: {
          'properties': {
            properties: {
              'title': {
                type: 'string'
              }
            }
          },
          'data': {
            elements: {
              optionalProperties: {
                'rowData': {
                  elements: {
                    properties: {
                      'values': {
                        elements: {
                          optionalProperties: {
                            'formattedValue': {
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

export { GoogleSheetsDlduData, validateGoogleSheetsDlduData }
