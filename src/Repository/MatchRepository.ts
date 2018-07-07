import { Match } from "../Entity/Match"
import { AwsS3ChangeMatchDateDataStore } from "../DataStore/ChangeMatchDateDataStore/AwsS3ChangeMatchDateDataStore"
import { JsonApiMatchDataStore } from "../DataStore/MatchDataStore/JsonApiMatchDataStore"

export interface MatchRepository {
  getUpdatedMatches(date: Date): Promise<Match[]>
}

export function createMatchRepository() {
  return new JsonApiMatchDataStore(new AwsS3ChangeMatchDateDataStore())
}
