import aws from "aws-sdk"

export interface ChangeMatchDateDataStore {
  get(): Promise<Date>
  save(date: Date): Promise<void>
}

export class AwsS3ChangeMatchDateDataStore implements ChangeMatchDateDataStore {
  private readonly s3 = new aws.S3()
  private readonly params = {
    Bucket: "tennis-1point-notice",
    Key: "changeDate.json",
  }

  async get(): Promise<Date> {
    await this.initializeForGet()

    let result: Date | undefined = undefined

    try {
      const data = await this.promisifiedGetObject(this.params)

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
      ...this.params,
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
    return new Promise((resolve, reject) => {
      this.s3.createBucket({ Bucket: this.params.Bucket }, (err, data) => {
        if (err) {
          reject(err)
        }

        resolve()
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
