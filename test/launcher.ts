import { handler } from "../src/services/prizm/handler";
require('dotenv').config()

// handler({ 
//   httpMethod: 'GET',
//   queryStringParameters: {
//     isPreview: 'true'
//   },
//   pathParameters: {
//     path: process.env.KEY,
//   }
// } as any, {} as any)

// handler({ 
//   httpMethod: 'GET',
// } as any, {} as any)

handler({ 
  httpMethod: 'POST',
  queryStringParameters: {
    path: 'example/prizm.csv',
  },
} as any, {} as any)