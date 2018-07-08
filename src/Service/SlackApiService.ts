import { Match } from "../Entity/Match"
import axios from "axios"
import { PostedMatch, PostedMatchId } from "../Entity/PostedMatch"

interface PostMatchService {
  post(match: Match): Promise<PostedMatch>
  update(postedMatchId: PostedMatchId, match: Match): Promise<void>
}

interface RequestBody {
  token: string
  channel: string
  username: string
  attachments: Array<{ fields: RequestBodyField[] }>
}

interface RequestBodyField {
  title: string
  value: string
  short: boolean
}

export class SlackApiPostMatchService implements PostMatchService {
  private readonly requestUrl = "https://slack.com/api/chat.postMessage"
  private readonly token = process.env.SLACK_TOKEN!
  private readonly channelNameId = process.env.SLACK_CHANNEL_NAME_ID!

  async post(match: Match): Promise<PostedMatch> {
    const requestJsonData: RequestBody = {
      token: this.token,
      channel: this.channelNameId,
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

    const response = await axios.post<PostResponse>(this.requestUrl!, requestJsonData, {
      headers: {
        Authorization: "Bearer " + this.token,
      },
    })
    if (response.status === 200 && response.data.ok) {
      return {
        postedMatchId: response.data.ts,
        matchId: match.id,
      }
    } else {
      throw new Error("SlackAPIへのリクエストが失敗した")
    }
  }
}

interface PostResponse {
  ok: boolean
  channel: string
  ts: PostedMatchId
  message: {
    text: string
    username: string
    bot_id: string
    attachments: any
    type: string
    subtype: string
    ts: PostedMatchId
  }
}
