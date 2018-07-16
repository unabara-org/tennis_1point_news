import axios from "axios"
import { Match } from "../../Entity/Match"
import { Player } from "../../Entity/Player"
import { Score } from "../../Entity/Score"
import { MatchRepository } from "../../Repository/MatchRepository"
import { JsonApiMatchesResponse, JsonApiMatchesResponseScore } from "./JsonApiMatchesResponse"

interface ResponseMatch {
  id: number
  tournamentType: string
  tournamentName: string
  seasonName: string
  homeScore: Score
  homePlayer: Player
  awayScore: Score
  awayPlayer: Player
  updatedAt: Date
}

export class JsonApiMatchDataStore implements MatchRepository {
  private requestUrl = "https://www.sofascore.com/tennis/livescore/json"

  async getMatches(date: Date): Promise<Match[]> {
    const response = await axios.get<JsonApiMatchesResponse>(this.requestUrl, {
      params: getQueryParams(date),
    })

    const data = response.data
    const allMatches = mapToResponseMatches(data)

    const matches = allMatches
      .filter(match => {
        return (
          match.tournamentType === "ATP" &&
          match.seasonName.indexOf("Singles") &&
          match.tournamentName.indexOf("Qualifying") > -1
        )
      })
      .map(responseMatch => {
        return new Match(responseMatch)
      })

    return matches
  }
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
        seasonName: tournament.season.name,
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
