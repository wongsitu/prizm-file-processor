import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Readable } from "stream";
import csvParser from "csv-parser";
import { RowType, getPRIZMCode } from "./shared/Utils";

const parser = csvParser();

// let cache: {[key:string]: string} = {};

export const processPrizmFile = async (event: APIGatewayProxyEvent, s3Client: S3Client): Promise<APIGatewayProxyResult> => {
  if (!event.pathParameters?.path) {
    return {
      statusCode: 400,
      body: 'Missing path parameter'
    }
  }

  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: event.pathParameters.path,
    // Range: 'bytes=0-2048',
  })

  const s3Result = await s3Client.send(command)

  if (!s3Result.Body) {
    return {
      statusCode: 404,
      body: 'File not found'
    }
  }

  const Body = s3Result.Body as Readable

  Body.pipe(parser)

  const onData = new Promise<RowType[]>((resolve) => {
    const response: RowType[] = [];
    parser.on('data', (row: RowType) => {
      response.push(row)
    });

    parser.on('end', () => {
      resolve(response);
    });
  });

  let csvFileResponse = await onData;

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