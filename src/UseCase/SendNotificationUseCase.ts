import { createMatchRepository } from "../Repository/MatchRepository"
import { createPostedMatchRepository } from "../Repository/PostedMatchRepository"
import { SlackApiPostMatchService } from "../Service/SlackApiService"
import { MatchImageCreateService } from "../Service/MatchImageCreateService"
import { createMatchImageRepository } from "../Repository/MatchImageRepository"

export const executeSendNotification = async (): Promise<void> => {
  const jsonApiMatchDataStore = createMatchRepository()
  const matches = await jsonApiMatchDataStore.getMatches(new Date())
  const matchImageRepository = createMatchImageRepository()
  const slackApiPostMatchService = new SlackApiPostMatchService(matchImageRepository)
  const matchImageCreateService = new MatchImageCreateService()
  const postedMatchRepository = createPostedMatchRepository()

  // S3のファイル名一覧を取得する
  const postedMatches = await postedMatchRepository.findAllPostedMatches()

  for (const match of matches) {
    const postedMatch = postedMatches.find(postedM => {
      return postedM.matchId === match.id
    })

    if (postedMatch == null) {
      const matchImagePath = await matchImageCreateService.execute(match)
      await matchImageRepository.saveByFilePath(match, matchImagePath)
      const postedMatch = await slackApiPostMatchService.post(match)
      await postedMatchRepository.save(postedMatch.postedMatchId, match)
    } else {
      await slackApiPostMatchService.update(postedMatch.postedMatchId, match)
    }
  }
}
