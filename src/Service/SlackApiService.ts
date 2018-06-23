import { Match } from "../Entity/Match"

interface PostMatchService {
  execute(match: Match): Promise<void>
}

interface RequestBody {
  username: string
  attachments: Array<{ fields: RequestBodyField[] }>
}

interface RequestBodyField {
  title: string
  value: string
  short: boolean
}

export class SlackApiPostMatchService implements PostMatchService {
  readonly requestUrl =
    "https://hooks.slack.com/services/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"

  execute(match: Match): Promise<void> {
    const requestJsonData: RequestBody = {
      username: match.tournamentName,
    }

    throw new Error("Method not implemented.")
  }
}
