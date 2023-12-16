import { handler } from "../src/services/prizm/handler";
require('dotenv').config()

handler({ 
  httpMethod: 'GET',
  queryStringParameters: {
    isPreview: 'true'
  },
  pathParameters: {
    path: process.env.KEY,
  }
} as any, {} as any)

// handler({ 
//   httpMethod: 'GET',
// } as any, {} as any)

// handler({ 
//   httpMethod: 'POST',
//   pathParameters: {
//     path: process.env.KEY,
//   },
//   queryStringParameters: {
//     postalCode: 'A0E1E0',
//   },
// } as any, {} as any)