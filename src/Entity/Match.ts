import { Score } from "./Score"
import { Player } from "./Player"
export interface Match {
  id: number
  tournamentName: string
  homeScore: Score
  homePlayer: Player
  awayScore: Score
  awayPlayer: Player
}
