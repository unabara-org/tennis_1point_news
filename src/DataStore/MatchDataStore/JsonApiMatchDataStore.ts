import axios from "axios"
import { Match, MatchStatus } from "../../Entity/Match"
import { Player } from "../../Entity/Player"
import { Score } from "../../Entity/Score"
import { MatchRepository } from "../../Repository/MatchRepository"
import { JsonApiMatchesResponse, JsonApiMatchesResponseScore, JsonApiMatchResponseStatus, JsonApiMatchesResponseMatch } from "./JsonApiMatchesResponse"
import { zeroPad } from "../../Util/zeroPad"

interface ResponseMatch {
  id: number
  tournamentType: string
  tournamentName: string
  homeScore: Score
  homePlayer: Player
  awayScore: Score
  awayPlayer: Player
  updatedAt: Date
  status: MatchStatus
  wonPlayerId?: number
}

export class JsonApiMatchDataStore implements MatchRepository {
  async getInProgressOrFinishedMatches(date: Date): Promise<Match[]> {
    const now = new Date()
    const year = now.getFullYear()
    const month = zeroPad((now.getMonth() + 1).toString(), 2)
    const day = zeroPad(now.getDate().toString(), 2)
    const dateForRequest = `${year}-${month}-${day}`

    const url = `https://www.sofascore.com/tennis//${dateForRequest}/json`

    const response = await axios.get<JsonApiMatchesResponse>(url, {
      params: getQueryParams(date),
    })

    const data = response.data
    const allMatches = mapToResponseMatches(data)

    const matches = allMatches
      .filter(match => {
        return isAtpSingles(match)
      })
      .filter(match => {
        return (
          match.status === MatchStatus.Finished ||
          match.status === MatchStatus.InProgress
        )
      })
      .map(responseMatch => {
        return new Match(responseMatch)
      })

    return matches
  }
}

function isAtpSingles(match: ResponseMatch): boolean {
  return (
    match.tournamentType === "ATP" &&
    match.tournamentName.indexOf("Doubles") === -1 &&
    match.tournamentName.indexOf("Qualifying") === -1
  )
}

interface SofaScoreRequestParams {
  _: string
}

export function getQueryParams(date: Date): SofaScoreRequestParams {
  const stringifyUnixTime = Math.round(date.getTime() / 1000).toString()

  // 末尾の一桁が必要ない
  const value = stringifyUnixTime.slice(0, stringifyUnixTime.length - 1)

  return {
    _: value,
  }
}

function mapToResponseMatches(jsonData: JsonApiMatchesResponse): ResponseMatch[] {
  const result: ResponseMatch[] = []
  const atpTournaments = jsonData.sportItem.tournaments

  atpTournaments.forEach(tournament => {
    tournament.events.forEach(event => {
      result.push({
        id: event.id,
        tournamentType: tournament.category.name,
        tournamentName: tournament.tournament.name,
        homeScore: mapToScore(event.homeScore),
        homePlayer: {
          id: event.homeTeam.id,
          imageUrl: `https://www.sofascore.com/images/team-logo/tennis_${event.homeTeam.id}.png`,
          name: event.homeTeam.name,
        },
        awayScore: mapToScore(event.awayScore),
        awayPlayer: {
          id: event.awayTeam.id,
          imageUrl: `https://www.sofascore.com/images/team-logo/tennis_${event.awayTeam.id}.png`,
          name: event.awayTeam.name,
        },
        updatedAt: new Date(event.changes.changeDate),
        status: mapToMatchStatus(event),
        wonPlayerId: mapToWonPlayerId(event)
      })
    })
  })

  return result
}

export function mapToScore(responseScore: JsonApiMatchesResponseScore): Score {
  // キー値の取り出し
  // 添字がperiodのみもののみを取り出した配列を作る
  const periodKeys = Object.keys(responseScore).filter(key => {
    return key.indexOf("period") !== -1
  })
  // JsonApiMatchesResponseScoreの型の順番に合うようにソートする
  periodKeys.sort()
  const game = periodKeys.map(periodKey => {
    return responseScore[periodKey]
  })

  // resultにセットしてreturnする
  return {
    winnerSet: responseScore.current,
    game: game,
    point: responseScore.point,
  }
}

function mapToMatchStatus(match: JsonApiMatchesResponseMatch): MatchStatus {
  switch (match.status.type) {
    case 'notstarted':
    return MatchStatus.NotStarted
    case 'inprogress':
    return MatchStatus.InProgress
    case 'finished':
    return MatchStatus.Finished
    
  }
}

function mapToWonPlayerId(match: JsonApiMatchesResponseMatch): number | undefined {
  switch (match.winnerCode) {
    case 0:
    case undefined:
    return undefined
    case 1:
      return match.homeTeam.id
    case 2:
      return match.awayTeam.id
    default:
      throw new Error()
  }
}