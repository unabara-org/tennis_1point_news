import path from "path"
import { Match } from "../Entity/Match"
import { Player } from "../Entity/Player"
import axios from "axios"

const fs = require("fs")
const gm = require("gm").subClass({ imageMagick: true })

export class MatchImageCreateService {
  private readonly VS_IMAGE_PATH = `https://s3.amazonaws.com/tennis-1point-notice/matchImages/vs_icon.png`

  /**
   * MatchImage のフルパスを返す
   */
  public async execute(match: Match): Promise<string> {
    const imagePaths = await Promise.all([
      this.saveImage(this.getPlayerImagePath(match.homePlayer)),
      this.saveImage(this.VS_IMAGE_PATH),
      this.saveImage(this.getPlayerImagePath(match.awayPlayer)),
    ])

    const savePath = path.resolve("/tmp/matchImage.png")

    return await this.saveMatchImage(imagePaths, savePath)
  }

  private getPlayerImagePath(player: Player): string {
    return `https://www.sofascore.com/images/team-logo/tennis_${player.id}.png`
  }

  /**
   * 保存したパスを返す
   */
  private saveImage(url: string): Promise<string> {
    return axios
      .get(url, {
        responseType: "arraybuffer",
      })
      .then(response => {
        const buffer = new Buffer(response.data)
        const fileName = Math.floor(Math.random() * 1000).toString()
        const path = `/tmp/${fileName}.png`

        fs.writeFileSync(path, buffer, "binary")

        return path
      })
  }

  /**
   * 保存した画像のパスを返す
   */
  private saveMatchImage(imagePaths: string[], savePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      gm(0, 0, "white")
        .noProfile()
        .append(imagePaths[0], imagePaths[1], imagePaths[2], true)
        .write(savePath, function(err: any) {
          if (err != null) {
            reject(err)
          }

          resolve(savePath)
        })
    })
  }
}
