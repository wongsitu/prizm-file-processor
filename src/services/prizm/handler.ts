import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { addCORSHeaders } from "./shared/Utils";
import { S3Client } from "@aws-sdk/client-s3";
import { getPrizmFile } from "./GetPrizmFile";

const s3Client = new S3Client({})

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>{
  let response: APIGatewayProxyResult | undefined
  
  try {
    switch (event.httpMethod) {
      case 'GET':
        response = await getPrizmFile(event, s3Client);
        break
      default:
        response = {
          statusCode: 422,
          body: JSON.stringify('Unprocessable Entity')
        }
        break;
    }
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify(error.message)
    };
  }

  console.log(response)
  addCORSHeaders(response);
  return response;
}

export { handler };