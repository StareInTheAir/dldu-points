interface DarkSoulsBoss {
  name: string
  points: number
  beaten: boolean
}

interface DarkSoulsLevel {
  name: string
  bosses: DarkSoulsBoss[]
}

interface DlduData {
  levels: DarkSoulsLevel[]
}

interface Token {
  token: string
  validUntil: number
}

export { DarkSoulsBoss, DarkSoulsLevel, DlduData, Token }
