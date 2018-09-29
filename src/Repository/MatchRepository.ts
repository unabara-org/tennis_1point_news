import { JsonApiMatchDataStore } from "../DataStore/MatchDataStore/JsonApiMatchDataStore"
import { Match } from "../Entity/Match"

export interface MatchRepository {
  getInProgressOrFinishedMatches(date: Date): Promise<Match[]>
}

export function createMatchRepository() {
  return new JsonApiMatchDataStore()
}
