import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getPRIZMCode } from "./shared/Utils";
import csvtojson from 'csvtojson';
import { json2csv } from 'json-2-csv';
import { ProcessSchema } from "./shared/Validators";

export const processPrizmFile = async (event: APIGatewayProxyEvent, s3Client: S3Client): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    return {
      statusCode: 422,
      body: 'Unprocessable Entity'
    }
  }
  const item = ProcessSchema.safeParse(JSON.parse(event.body))

  if (!item.success) {
    return {
      statusCode: 400,
      body: 'Missing path parameter'
    }
  }

  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: item.data.path,
  })

  const s3Result = await s3Client.send(command)

  if (!s3Result.Body) {
    return {
      statusCode: 404,
      body: 'File not found'
    }
  }

  const str = await s3Result.Body.transformToString();
  const csvFileResponse = await csvtojson().fromString(str)

  // let cache: Record<string, number> = {}

  const promiseArray = csvFileResponse.map(async (element) => {
      const pCode = element['Postal Code']
      const prizmId = await getPRIZMCode(pCode)

      return {
        ...element,
        prizmId
      };
  });

  const response = await Promise.all(promiseArray)
    .then((responses) => {
      return responses
    })

  const csvContent = json2csv(response)

  const putCommand = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: item.data.path,
    Body: csvContent,
  })

  await s3Client.send(putCommand)

  return {
    statusCode: 200,
    body: JSON.stringify(response)
  }
}