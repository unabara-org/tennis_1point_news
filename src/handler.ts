import { JsonApiMatchDataStore } from "./DataStore/MatchDataStore/JsonApiMatchDataStore"
import { SlackApiPostMatchService } from "./Service/SlackApiService"
import { APIGatewayEvent, Callback, Context, Handler } from "aws-lambda"
import { createMatchRepository } from "./Repository/MatchRepository"

const executeSendNotification = (): Promise<void> => {
  const jsonApiMatchDataStore = createMatchRepository()
  return jsonApiMatchDataStore.getUpdatedMatches(new Date()).then(matches => {
    console.log(matches)
    const slackApiPostMatchService = new SlackApiPostMatchService()
    matches.forEach(match => {
      slackApiPostMatchService.execute(match)
    })
  })
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
