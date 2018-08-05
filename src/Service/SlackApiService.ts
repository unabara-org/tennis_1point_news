import axios from "axios"
import { Match } from "../Entity/Match"
import { PostedMatch, PostedMatchId } from "../Entity/PostedMatch"
import {
  MatchImageRepository,
  createMatchImageRepository,
} from "../Repository/MatchImageRepository"

interface PostMatchService {
  post(match: Match): Promise<PostedMatch>
  update(postedMatchId: PostedMatchId, match: Match): Promise<PostedMatch>
}

interface PostRequestBody {
  token: string
  channel: string
  username: string
  text: string
  attachments: Array<{ fields: RequestBodyField[] }>
}

interface UpdateRequestBody {
  token: string
  channel: string
  username: string
  text: string
  attachments: Array<{ fields: RequestBodyField[] }>
  ts: string
}

interface RequestBodyField {
  title: string
  value: string
  short: boolean
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

export function createPostMatchService() {
  return new SlackApiPostMatchService(createMatchImageRepository())
}

export class SlackApiPostMatchService implements PostMatchService {
  private readonly requestUrl = {
    post: "https://slack.com/api/chat.postMessage",
    update: "https://slack.com/api/chat.update",
  }
  private readonly token = process.env.SLACK_TOKEN!
  private readonly channelNameId = process.env.SLACK_CHANNEL_NAME_ID!

  constructor(private matchImageRepository: MatchImageRepository) {}

  /**
   * 試合情報を投稿する
   */
  async post(match: Match): Promise<PostedMatch> {
    const requestJsonData: PostRequestBody = await this.buildRequestBody(match)

    const response = await this.request(this.requestUrl.post!, requestJsonData)

    return {
      postedMatchId: response.ts,
      matchId: match.id,
    }
  }

  /**
   * 対象の postedMatchId (ts) の試合情報を更新する
   * (Slack に通知済みの試合情報を最新の試合情報に更新)
   *
   * @param postedMatchId
   * @param match
   */
  async update(postedMatchId: string, match: Match): Promise<PostedMatch> {
    const requestJsonData: UpdateRequestBody = {
      ...(await this.buildRequestBody(match)),
      ts: postedMatchId,
    }

    const response = await this.request(this.requestUrl.update!, requestJsonData)

    return {
      postedMatchId: response.ts,
      matchId: match.id,
    }
  }

  /**
   * Slack Api への新規投稿/更新するリクエストを送信する
   *
   * @param url
   * @param body
   */
  private async request(
    url: string,
    body: PostRequestBody | UpdateRequestBody
  ): Promise<PostResponse> {
    const response = await axios.post<PostResponse>(url, body, {
      headers: {
        Authorization: "Bearer " + this.token,
      },
    })

    if (response.status === 200 && response.data.ok) {
      return response.data
    } else {
      throw new Error("SlackAPIへのリクエストが失敗した")
    }
  }

  /*
   * RequestBody を生成する
   */
  private buildRequestBody = async (match: Match): Promise<PostRequestBody> => {
    const matchImageUrl = this.matchImageRepository.getImageUrl(match)

    return {
      token: this.token,
      channel: this.channelNameId,
      username: match.tournamentName,
      text: `${match.getMatchName()}\n\n${matchImageUrl}`,
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
  }
}
