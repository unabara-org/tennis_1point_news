import { APIGatewayEvent, Context, Handler } from "aws-lambda"
import { executeSendNotification } from "./UseCase/sendNotificationUseCase"
import { executeCleanUpPostedMatchData } from "./UseCase/CleanUpPostedMatchDataUseCase"

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
      const response = { statusCode: 500 }
      cb(null, response)
    })
}

export const cleanUpPostedMatchData: Handler = (
  event: APIGatewayEvent,
  context: Context,
  cb: any
): Promise<void> => {
  return executeCleanUpPostedMatchData()
    .then(() => {
      const response = { statusCode: 204 }
      cb(null, response)
    })
    .catch((err: Error) => {
      const response = { statusCode: 500 }
      cb(null, response)
    })
}
