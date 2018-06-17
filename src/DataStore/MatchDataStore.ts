import axios from "axios"
import { Match } from "../Entity/Match"
import {
  JsonApiMatchesResponse,
  JsonApiMatchesResponseScore,
} from "./JsonApiMatchesResponse"
import { Score } from "../Entity/Score"

export interface MatchDataStore {
  getCurrentMatches(): Promise<Match[]>
  getPreviousMatches(): Match[]
}

export class JsonApiMatchDataStore implements MatchDataStore {
  private requestUrl = "https://www.sofascore.com/tennis/livescore/json"

  async getCurrentMatches(): Promise<Match[]> {
    const response = await axios.get<JsonApiMatchesResponse>(this.requestUrl, {
      params: getQueryParams(new Date()),
    })
    const data = response.data
    return mapToMatches(data)
  }

  getPreviousMatches(): Match[] {
    return []
  }

  private save(): Promise<void> {
    return new Promise(() => {})
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

function mapToMatches(jsonData: JsonApiMatchesResponse): Match[] {
  const result: Match[] = []
  const atpTournaments = jsonData.sportItem.tournaments.filter(tournament => {
    const tournamentName = tournament.category.name
    return tournamentName === "ATP" && tournamentName.indexOf("Doubles") === -1
  })

  atpTournaments.forEach(tournament => {
    tournament.events.forEach(event => {
      result.push({
        id: event.id,
        tournamentName: tournament.tournament.name,
        homeScore: mapToScore(event.homeScore),
        homePlayer: {
          id: event.homeTeam.id,
          imageUrl: `https://www.sofascore.com/images/team-logo/tennis_${
            event.homeTeam.id
          }.png`,
          name: event.homeTeam.name,
        },
        awayScore: mapToScore(event.awayScore),
        awayPlayer: {
          id: event.awayTeam.id,
          imageUrl: `https://www.sofascore.com/images/team-logo/tennis_${
            event.awayTeam.id
          }.png`,
          name: event.awayTeam.name,
        },
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
