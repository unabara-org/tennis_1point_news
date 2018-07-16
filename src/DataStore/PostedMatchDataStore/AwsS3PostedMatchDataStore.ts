import aws from "aws-sdk"
import { PostedMatchRepository } from "../../Repository/PostedMatchRepository"
import { exists } from "fs"
import { PostedMatchId, PostedMatch } from "../../Entity/PostedMatch"
import { Match } from "../../Entity/Match"

export class AwsS3PostedMatchDataStore implements PostedMatchRepository {
  private readonly s3 = new aws.S3()
  private readonly bucketName = "tennis-1point-notice"
  private readonly dirName = "matchData/"
  private readonly bucketParams = {
    Bucket: this.bucketName,
  }
  private readonly postedMatchObjectParams = {
    Bucket: this.bucketName,
    Key: "",
  }

  async findAllPostedMatches(): Promise<PostedMatch[]> {
    await this.initializeForFindAll()

    // S3からlistでバケット内のファイルリストを取得
    const data = await this.listObjects({ Bucket: this.postedMatchObjectParams.Bucket })

    if (data.Contents == null) {
      return []
    }

    // S3に保存されているファイル一覧を返す
    return data.Contents.filter(content => {
      return content.Key != null
    }).map(content => {
      return getPostedMatch(this.dirName, content.Key!)
    })
  }

  async save(postedMatchId: PostedMatchId, match: Match): Promise<void> {
    const saveParams = {
      ...this.postedMatchObjectParams,
      Key: this.dirName + getPostedMatchKey(postedMatchId, match),
    }

    await this.putObject(saveParams)
    return undefined
  }

  async deleteByPostedMatch(postedMatch: PostedMatch): Promise<void> {
    const deleteParams = {
      ...this.postedMatchObjectParams,
      Key: this.dirName + `${postedMatch.postedMatchId}-${postedMatch.matchId}`,
    }

    console.log("deleteByPostedMatch desu")

    await this.deleteObject(deleteParams)
    return undefined
  }

  private initializeForFindAll(): Promise<void> {
    return this.exitsBucket().then(exists => {
      // S3に指定のバケットが存在した場合
      if (exists) {
        return undefined
      }

      // S3に指定のバケットが存在しない場合は作成する
      this.s3.createBucket({ Bucket: this.postedMatchObjectParams.Bucket }, (err, data) => {
        if (err) {
          Promise.reject(err)
        }

        Promise.resolve()
      })
    })
  }

  private exitsBucket(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.s3.headBucket(this.bucketParams, (err, data) => {
        if (err) {
          reject(err)
        }

        resolve(data !== null)
      })
    })
  }

  private listObjects(
    params: aws.S3.Types.ListObjectsRequest
  ): Promise<aws.S3.Types.ListObjectsOutput> {
    return new Promise((resolve, reject) => {
      this.s3.listObjects(params, (err, data) => {
        if (err != null) {
          reject(err.message)
        }
        resolve(data)
      })
    })
  }

  private putObject(params: aws.S3.Types.PutObjectRequest): Promise<aws.S3.Types.PutObjectOutput> {
    return new Promise((resolve, reject) => {
      this.s3.putObject(params, function(err, data) {
        if (err) {
          reject(err)
        }

        resolve(data)
      })
    })
  }

  private deleteObject(
    params: aws.S3.Types.DeleteObjectRequest
  ): Promise<aws.S3.Types.DeleteObjectOutput> {
    return new Promise((resolve, reject) => {
      this.s3.deleteObject(params, function(err, data) {
        if (err) {
          console.log("furukawa desu")
          console.log(err)
          reject(err)
        }
        console.log("shigematsu desu")
        console.log(data)
        resolve(data)
      })
    })
  }
}

type PostedMatchKey = string

function getPostedMatch(prefix: string, k: PostedMatchKey): PostedMatch {
  // k から prefix の文字列を削除している
  const key = k.slice(prefix.length, k.length)
  const items = key.split("-")

  return {
    postedMatchId: items[0],
    matchId: Number(items[1]),
  }
}

function getPostedMatchKey(postedMatchId: PostedMatchId, match: Match): PostedMatchKey {
  return `${postedMatchId}-${match.id}`
}
