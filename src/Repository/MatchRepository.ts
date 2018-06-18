import { Match } from "../Entity/Match"

export interface MatchRepository {
  getUpdatedMatches(date: Date): Promise<Match[]>
}
