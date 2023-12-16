import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getPRIZMCode } from "./shared/Utils";
import csvtojson from 'csvtojson';

// let cache: {[key:string]: string} = {};

export const processPrizmFile = async (event: APIGatewayProxyEvent, s3Client: S3Client): Promise<APIGatewayProxyResult> => {
  if (!event.queryStringParameters?.path) {
    return {
      statusCode: 400,
      body: 'Missing path parameter'
    }
  }

  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: event.queryStringParameters.path,
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

  const promiseArray = csvFileResponse.map(async (element) => {
      const prizmId = await getPRIZMCode(element['Postal Code'])

      return {
        ...element,
        prizmId
      };
  });

  const response = await Promise.all(promiseArray)
    .then((responses) => {
      return responses
    })

  return {
    statusCode: 200,
    body: JSON.stringify(response)
  }
}