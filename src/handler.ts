import { APIGatewayEvent, Context, Handler } from "aws-lambda"
import { createMatchRepository } from "./Repository/MatchRepository"
import { createPostedMatchRepository } from "./Repository/PostedMatchRepository"
import { SlackApiPostMatchService } from "./Service/SlackApiService"

const executeSendNotification = async (): Promise<void> => {
  const jsonApiMatchDataStore = createMatchRepository()
  const matches = await jsonApiMatchDataStore.getUpdatedMatches(new Date())
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

export const sendNotification: Handler = (
  event: APIGatewayEvent,
  context: Context,
  cb: any
): Promise<void> => {
  return executeSendNotification()
    .then(() => {
      const response = { statusCode: 204 }
      cb(null, response)
    })
    .catch((err: Error) => {
      console.log(err)
      const response = { statusCode: 500 }
      cb(null, response)
    })
}

executeSendNotification()
