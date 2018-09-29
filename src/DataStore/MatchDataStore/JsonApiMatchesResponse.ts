export interface JsonApiMatchesResponse {
  sportItem: {
    tournaments: Array<{
      tournament: {
        name: string
      }
      category: {
        name: string
      }
      season?: {
        name: string
      }
      events: JsonApiMatchesResponseMatch[]
    }>
  }
}

export interface JsonApiMatchesResponseMatch {
  id: number
  status: JsonApiMatchResponseStatus
  winnerCode: WinnerCode
  homeTeam: {
    name: string
    id: number
  }
  awayTeam: {
    name: string
    id: number
  }
  homeScore: JsonApiMatchesResponseScore
  awayScore: JsonApiMatchesResponseScore
  changes: {
    changeDate: string
  }
}

type StatusType = "notstarted" | "inprogress" | "finished"

// TODO: 値自体の意味は未確認なので後で確認して適切な値に変更すること
type WinnerCode = 0 | 1 | 2

export interface JsonApiMatchesResponseScore {
  current: number
  point: any
  // period1?: number
  // period2?: number
  // period3?: number
  // period4?: number
  // period5?: number
  // period6?: number
  [period: string]: number
}

export interface JsonApiMatchResponseStatus {
  code: number
  type: StatusType
}