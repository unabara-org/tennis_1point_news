import { Score } from "./Score"
import { Player } from "./Player"

interface MatchProps {
  id: number
  tournamentType: string
  tournamentName: string
  homeScore: Score
  homePlayer: Player
  awayScore: Score
  awayPlayer: Player
  status: MatchStatus
  wonPlayerId?: number
}

export enum MatchStatus {
  NotStarted,
  InProgress,
  Finished
}

export class Match {
  id: number
  tournamentType: string
  tournamentName: string
  homeScore: Score
  homePlayer: Player
  awayScore: Score
  awayPlayer: Player
  status: MatchStatus
  wonPlayerId?: number

  constructor(props: MatchProps) {
    this.id = props.id
    this.tournamentType = props.tournamentType
    this.tournamentName = props.tournamentName
    this.homeScore = props.homeScore
    this.homePlayer = props.homePlayer
    this.awayScore = props.awayScore
    this.awayPlayer = props.awayPlayer
    this.status = props.status
    this.wonPlayerId = props.wonPlayerId
  }

  getMatchName(): string {
    return `${this.getPlayerNameText(this.homePlayer)} vs ${this.getPlayerNameText(this.awayPlayer)}`
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

  private getPlayerNameText(player: Player): string {
    const trophyIcon = "%F0%9F%8F%86"

    if (this.status == MatchStatus.Finished && this.wonPlayerId != null && this.wonPlayerId === player.id) {
      return `${trophyIcon} ${player.name}`
    }
    return player.name
  }
}
