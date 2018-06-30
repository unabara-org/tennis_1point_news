import { Match } from "../Entity/Match"
import axios from "axios"

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
  private readonly requestUrl = process.env.SLACK_WEBHOOK_URL

  async execute(match: Match): Promise<void> {
    const requestJsonData: RequestBody = {
      username: match.getMatchName(),
      attachments: [
        {
          fields: [
            {
              title: "セット",
              value: match.getSetScoreText(),
              short: true,
            },
            {
              title: "ゲーム",
              value: match.getGameScoreText(),
              short: true,
            },
            {
              title: "ポイント",
              value: match.getPointScoreText(),
              short: false,
            },
          ],
        },
      ],
    }

    const response = await axios.post(this.requestUrl!, requestJsonData)
    if (response.status === 200) {
      return undefined
    } else {
      throw new Error("SlackAPIへリクエストを投げた際にHTTPステータスが200以外で返ってきました")
    }
  }
}
