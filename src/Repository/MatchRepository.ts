import { JsonApiMatchDataStore } from "../DataStore/MatchDataStore/JsonApiMatchDataStore"
import { Match } from "../Entity/Match"

export interface MatchRepository {
  getMatches(date: Date): Promise<Match[]>
}

export function createMatchRepository() {
  return new JsonApiMatchDataStore()
}
