import { PostedMatchId, PostedMatch } from "../Entity/PostedMatch"
import { Match } from "../Entity/Match"

export interface PostedMatchRepository {
  findAll(): Promise<PostedMatch[]>
  findBypostedMatchId(postedMatchId: PostedMatchId): Promise<PostedMatch | undefined>
  save(postedMatchId: PostedMatchId, match: Match): Promise<void>
  deleteBypostedMatchId(postedMatchId: PostedMatchId): Promise<void>
}
