interface DarkSoulsBoss {
  name: string
  points: number
  beaten: boolean
}

interface DarkSoulsLevel {
  name: string
  bosses: DarkSoulsBoss[]
  alwaysShowBosses: boolean
}

interface DlduData {
  levels: DarkSoulsLevel[]
}

export { DarkSoulsBoss, DarkSoulsLevel, DlduData }
