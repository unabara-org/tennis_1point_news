import axios from "axios"
const furukawaFunc = async () => {
  const slackApiUrl =
    "https://hooks.slack.com/services/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"
  const kazukiJson = {
    text: "全英オープン フェデラー vs ナダル",
    attachments: [
      {
        fields: [
          {
            title: "セット",
            value: "1-2",
            short: true,
          },
          {
            title: "ゲーム",
            value: "3-4",
            short: true,
          },
          {
            title: "ポイント",
            value: "15-30",
            short: false,
          },
        ],
      },
    ],
  }

  const response = await axios.post(slackApiUrl, kazukiJson)

  if (response.status === 200) {
    return undefined
  } else {
    throw new Error("かずきです")
  }
}
furukawaFunc()
