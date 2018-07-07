import { PostedId, PostedMatch } from "../Entity/PostedMatch"
import { Match } from "../Entity/Match"

export interface PostedMatchRepository {
  findAll(): Promise<PostedMatch[]>
  findByPostedId(postedId: PostedId): Promise<PostedMatch | undefined>
  save(postedId: PostedId, match: Match): Promise<void>
  deleteByPostedId(postedId: PostedId): Promise<void>
}
