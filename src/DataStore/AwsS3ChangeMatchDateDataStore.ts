import aws from "aws-sdk"
import { ChangeMatchDateRepository } from "../Repository/ChangeMatchDataRepository";

export class AwsS3ChangeMatchDateDataStore implements ChangeMatchDateRepository {
  private readonly s3 = new aws.S3()
  private readonly bucketName = "tennis-1point-notice"
  private readonly objectKey = "changeDate.json"
  private readonly bucketParams = {
    Bucket: this.bucketName,
  }
  private readonly changeDateObjectParams = {
    Bucket: this.bucketName,
    Key: this.objectKey,
  }

  async get(): Promise<Date> {
    await this.initializeForGet()

    let result: Date | undefined = undefined

    try {
      const data = await this.promisifiedGetObject(this.changeDateObjectParams)

      if (data.Body == null) {
        throw new Error("s3.getObjectの戻り値であるdata.Bodyがnullもしくはundefinedです")
      }

      const object: ChangeDate = JSON.parse(data.Body.toString())

      result = new Date(object.changeDate)
    } catch (e) {
      if (e.statusCode === 404) {
        result = new Date(1993, 2, 2)
      }
    }

    return result!
  }

  async save(date: Date): Promise<void> {
    const body: ChangeDate = {
      changeDate: date.toString(),
    }
    const saveParams = {
      ...this.changeDateObjectParams,
      Body: JSON.stringify(body),
    }

    this.s3.putObject(saveParams, function(err) {
      if (err) {
        throw err
      }
      return undefined
    })
  }

  private initializeForGet(): Promise<void> {
    return this.exitsBucket().then(exists => {
      if (exists) {
        return undefined
      }

      this.s3.createBucket({ Bucket: this.changeDateObjectParams.Bucket }, (err, data) => {
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

  private promisifiedGetObject(params: aws.S3.GetObjectRequest): Promise<aws.S3.GetObjectOutput> {
    return new Promise((resolve, reject) => {
      this.s3.getObject(params, (err, data) => {
        if (err) {
          reject(err)
        }

        resolve(data)
      })
    })
  }
}

interface ChangeDate {
  changeDate: string
}
