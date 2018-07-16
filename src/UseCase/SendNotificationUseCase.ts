import { createMatchRepository } from "../Repository/MatchRepository";
import { SlackApiPostMatchService } from "../Service/SlackApiService";
import { createPostedMatchRepository } from "../Repository/PostedMatchRepository";

export const executeSendNotification = async (): Promise<void> => {
  const jsonApiMatchDataStore = createMatchRepository()
  const matches = await jsonApiMatchDataStore.getMatches(new Date())
  const slackApiPostMatchService = new SlackApiPostMatchService()
  const postedMatchRepository = createPostedMatchRepository()

  // S3のファイル名一覧を取得する
  const postedMatches = await postedMatchRepository.findAllPostedMatches()

  for (const match of matches) {
    const postedMatch = postedMatches.find(postedM => {
      return postedM.matchId === match.id
    })

    if (postedMatch == null) {
      const postedMatch = await slackApiPostMatchService.post(match)
      await postedMatchRepository.save(postedMatch.postedMatchId, match)
    } else {
      await slackApiPostMatchService.update(postedMatch.postedMatchId, match)
    }
  }
}