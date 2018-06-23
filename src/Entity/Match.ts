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
}

export class Match {
  id: number
  tournamentType: string
  tournamentName: string
  homeScore: Score
  homePlayer: Player
  awayScore: Score
  awayPlayer: Player

  constructor(props: MatchProps) {
    this.id = props.id
    this.tournamentType = props.tournamentType
    this.tournamentName = props.tournamentName
    this.homeScore = props.homeScore
    this.homePlayer = props.homePlayer
    this.awayScore = props.awayScore
    this.awayPlayer = props.awayPlayer

  }

  getMatchName(): string {
    return `${this.tournamentName} ${this.homePlayer.name} vs ${this.awayPlayer.name} ��`
  }
}
