import path from "path"
import { Match } from "../Entity/Match"
import { Player } from "../Entity/Player"

const fs = require("fs")
const gm = require("gm").subClass({ imageMagick: true })

export class MatchImageCreateService {
  private readonly VS_IMAGE_PATH = `${__dirname}/../assets/images/vs_icon.png`

  /**
   * MatchImage のフルパスを返す
   */
  public execute(match: Match): Promise<string> {
    const savePath = path.resolve(__dirname, "./src/matchImage.png")

    return new Promise((resolve, reject) => {
      gm(0, 0, "white")
        .noProfile()
        .append(
          this.getPlayerImagePath(match.homePlayer),
          this.VS_IMAGE_PATH,
          this.getPlayerImagePath(match.awayPlayer),
          true
        )
        .write(savePath, function(err: any) {
          if (err != null) {
            reject(err)
          }

          resolve(savePath)
        })
    })
  }

  private getPlayerImagePath(player: Player): string {
    return `https://www.sofascore.com/images/team-logo/tennis_${player.id}.png`
  }
}
