import { PostedMatchId, PostedMatch } from "../Entity/PostedMatch"
import { Match } from "../Entity/Match"
import { AwsS3PostedMatchDataStore } from "../DataStore/PostedMatchDataStore/AwsS3PostedMatchDataStore"

export interface PostedMatchRepository {
  findAllPostedMatches(): Promise<PostedMatch[]>
  save(postedMatchId: PostedMatchId, match: Match): Promise<void>
  deleteBypostedMatchId(postedMatchId: PostedMatchId): Promise<void>
}

export function createPostedMatchRepository() {
  return new AwsS3PostedMatchDataStore()
}
