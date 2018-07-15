import { Score } from "./Score"
import { Player } from "./Player"

interface MatchProps {
  id: number
  tournamentType: string
  tournamentName: string
  seasonName: string
  homeScore: Score
  homePlayer: Player
  awayScore: Score
  awayPlayer: Player
}

export class Match {
  id: number
  tournamentType: string
  tournamentName: string
  seasonName: string
  homeScore: Score
  homePlayer: Player
  awayScore: Score
  awayPlayer: Player

  constructor(props: MatchProps) {
    this.id = props.id
    this.tournamentType = props.tournamentType
    this.tournamentName = props.tournamentName
    this.seasonName = props.tournamentName
    this.homeScore = props.homeScore
    this.homePlayer = props.homePlayer
    this.awayScore = props.awayScore
    this.awayPlayer = props.awayPlayer
  }

  getMatchName(): string {
    return `${this.homePlayer.name} vs ${this.awayPlayer.name}`
  }

  getSetScoreText(): string {
    return `${this.homeScore.winnerSet}-${this.awayScore.winnerSet}`
  }

  getGameScoreText(): string {
    const latestGameIndex = this.homeScore.game.length - 1
    return `${this.homeScore.game[latestGameIndex]}-${this.awayScore.game[latestGameIndex]}`
  }

  getPointScoreText(): string {
    if (this.homeScore.point == null || this.awayScore.point == null) {
      return ""
    }
    return `${this.homeScore.point}-${this.awayScore.point}`
  }
}
