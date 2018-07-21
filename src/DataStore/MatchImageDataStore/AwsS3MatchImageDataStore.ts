import aws from "aws-sdk"
import fs from "fs"
import { MatchImageRepository } from "../../Repository/MatchImageRepository"
import { Match } from "../../Entity/Match"
import { resolve } from "dns"

export class AwsS3MatchImageDataStore implements MatchImageRepository {
  private readonly s3 = new aws.S3()
  private readonly bucketName = "tennis-1point-notice"
  private readonly dirName = "matchImages/"
  private readonly imageBaseUrl = `https://s3.amazonaws.com/${this.bucketName}/`
  private readonly objectParams = {
    Bucket: this.bucketName,
    ACL: "public-read",
  }

  /**
   * s3 にアップロードされた画像の URL を返す
   */
  public saveByFilePath(match: Match, filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const imageData = fs.readFileSync(filePath)

      const params = {
        ...this.objectParams,
        Key: this.getKeyName(match),
        Body: imageData,
      }

      this.s3.putObject(params, (err, data) => {
        if (err != null) {
          reject(err)
        }

        resolve(`${this.imageBaseUrl}${this.getKeyName(match)}`)
      })
    })
  }

  public getImageUrl(match: Match): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve(`${this.imageBaseUrl}${this.getKeyName(match)}`)
    })
  }

  /**
   * s3 で使う Key を返す
   */
  private getKeyName(match: Match): string {
    return `matchImages/${match.id}.png`
  }
}
