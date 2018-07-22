import { Match } from "../Entity/Match"
import { AwsS3MatchImageDataStore } from "../DataStore/MatchImageDataStore/AwsS3MatchImageDataStore"

export interface MatchImageRepository {
  saveByFilePath(match: Match, filePath: string): Promise<string>
  deleteByMatchId(matchId: number): Promise<void>
  getImageUrl(match: Match): Promise<string>
}

export function createMatchImageRepository() {
  return new AwsS3MatchImageDataStore()
}
