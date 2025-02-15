import type { DarkSoulsLevel, DlduData } from './types'

function totalLevelPoints (level: DarkSoulsLevel): number {
  return level.bosses.reduce((prev, current) => { return prev + current.points }, 0)
}

function achievedLevelPoints (level: DarkSoulsLevel): number {
  return level.bosses.reduce((prev, current) => prev + (current.beaten ? current.points : 0), 0)
}

function totalRunPoints (data: DlduData): number {
  return data.levels.reduce((prev, current) => prev + totalLevelPoints(current), 0)
}

function achievedRunPoints (data: DlduData): number {
  return data.levels.reduce((prev, current) => prev + achievedLevelPoints(current), 0)
}

export { totalLevelPoints, achievedLevelPoints, totalRunPoints, achievedRunPoints }
