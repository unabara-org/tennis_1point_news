import aws from "aws-sdk"
import fs from "fs"
import { MatchImageRepository } from "../../Repository/MatchImageRepository"
import { Match } from "../../Entity/Match"

export class AwsS3MatchImageDataStore implements MatchImageRepository {
  private readonly s3 = new aws.S3()
  private readonly bucketName = "tennis-1point-notice"
  private readonly dirName = "matchImages/"
  private readonly imageBaseUrl = `https://s3.amazonaws.com/${this.bucketName}/`
  private readonly objectParams = {
    Bucket: this.bucketName,
  }

  /**
   * s3 にアップロードされた画像の URL を返す
   */
  public saveByFilePath(match: Match, filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const imageData = fs.readFileSync(filePath)

      // いまは png だけ
      // 好きに mimetype を取得する実装に変更してくれ
      const params = {
        ...this.objectParams,
        ACL: "public-read",
        Key: this.getKeyName(match),
        Body: imageData,
        ContentType: "image/png",
      }

      this.s3.putObject(params, (err, data) => {
        if (err != null) {
          reject(err)
        }

        resolve(`${this.imageBaseUrl}${this.getKeyName(match)}`)
      })
    })
  }

  public deleteByMatchId(matchId: number): Promise<void> {
    const params = {
      ...this.objectParams,
      Key: this.getKeyNameByMatchId(matchId),
    }

    return new Promise((resolve, reject) => {
      this.s3.deleteObject(params, (err, data) => {
        if (err != null) {
          reject(err)
        }

        resolve()
      })
    })
  }

  public getImageUrl(match: Match): string {
    const currentTimeStamp = (new Date()).getTime();
    return `${this.imageBaseUrl}${this.getKeyName(match)}?${currentTimeStamp.toString()}`
  }

  /**
   * s3 で使う Key を返す
   */
  private getKeyName(match: Match): string {
    return `matchImages/${match.id}.png`
  }

  /**
   * s3 で使う Key を返す
   */
  private getKeyNameByMatchId(matchId: number): string {
    return `matchImages/${matchId}.png`
  }
}
