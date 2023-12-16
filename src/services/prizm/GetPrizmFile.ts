import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import csvParser from "csv-parser";
import { Readable } from "stream";

const parser = csvParser();

type RowType = {
  StoreID: string;
  Customer_ID: string;
  'Postal Code': string;
  Total_Visits: `${number}`,
  'Dollars Spend': `${number}`,
  'Product Type': string;
}

export const getPrizmFile = async (event: APIGatewayProxyEvent, s3Client: S3Client): Promise<APIGatewayProxyResult> => {
  if (!event.queryStringParameters?.path) {
    return {
      statusCode: 422,
      body: 'Missing path'
    }
  }

  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: event.queryStringParameters?.path,
    Range: event.queryStringParameters.isPreview ? 'bytes=0-512' : undefined,
  })

  const result = await s3Client.send(command)

  const Body = result.Body as Readable

  Body.pipe(parser)

  const onData = new Promise<RowType[]>((resolve) => {
    const response: RowType[] = [];
    parser.on('data', (row: RowType) => {
      response.push(row);
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