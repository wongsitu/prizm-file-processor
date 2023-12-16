import { GetObjectCommand, ListObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import csvParser from "csv-parser";
import { Readable } from "stream";
import { RowType } from "./shared/Utils";

const parser = csvParser();

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

  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: event.pathParameters.path,
    Range: event.queryStringParameters?.isPreview ? 'bytes=0-512' : undefined,
  })

  const result = await s3Client.send(command)

  if (!result.Body) {
    return {
      statusCode: 404,
      body: 'File not found'
    }
  }

  const Body = result.Body as Readable

  Body.pipe(parser)

  const onData = new Promise<RowType[]>((resolve) => {
    const response: RowType[] = [];
    parser.on('data', (row: RowType) => {
      if (response.length < 6 && event.queryStringParameters?.isPreview) {
        response.push(row);
      } else {
        response.push(row);
      }
    });

    parser.on('end', () => {
      resolve(response);
    });
  });

  const response = await onData;

  return {
    statusCode: 200,
    body: JSON.stringify(response)
  }
}