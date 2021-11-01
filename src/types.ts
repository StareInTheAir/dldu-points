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

interface AccessToken {
  token: string
  validUntil: number
}

export { DarkSoulsBoss, DarkSoulsLevel, DlduData, AccessToken }
