import { Score } from "./Score"
import { Player } from "./Player"
export interface Match {
  id: number
  tournamentType: string
  tournamentName: string
  homeScore: Score
  homePlayer: Player
  awayScore: Score
  awayPlayer: Player
}
