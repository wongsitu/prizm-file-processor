import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { addCORSHeaders } from "./shared/Utils";

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>{
  let response: APIGatewayProxyResult | undefined
  

  response = {
    statusCode: 200,
    body: JSON.stringify('Success')
  }

  addCORSHeaders(response);
  return response;
}

export { handler };