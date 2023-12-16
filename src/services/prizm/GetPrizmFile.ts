import { GetObjectCommand, ListObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import csvtojson from 'csvtojson';

export const getPrizmFile = async (event: APIGatewayProxyEvent, s3Client: S3Client): Promise<APIGatewayProxyResult> => {
  if (!event.pathParameters) {
    const command = new ListObjectsCommand({
      Bucket: process.env.BUCKET_NAME,
    })

    const result = await s3Client.send(command)

    return {
      statusCode: 200,
      body: JSON.stringify(result.Contents || [])
    }
  }

  if (!event.pathParameters) {
    return {
      statusCode: 400,
      body: 'Missing path parameter'
    }
  }

  const isPreview = event.queryStringParameters?.isPreview === 'true'

  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: event.pathParameters.path,
    Range: isPreview ? 'bytes=0-512' : undefined,
  })

  const result = await s3Client.send(command)

  if (!result.Body) {
    return {
      statusCode: 404,
      body: 'File not found'
    }
  }

  const str = await result.Body.transformToString();
  const parsedJSON = await csvtojson().fromString(str)
  const response = isPreview ? parsedJSON.slice(0, 6) : parsedJSON

  return {
    statusCode: 200,
    body: JSON.stringify(response)
  }
}