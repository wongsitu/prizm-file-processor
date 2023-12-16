import { handler } from "../src/services/prizm/handler";
require('dotenv').config()

// handler({ 
//   httpMethod: 'GET',
//   queryStringParameters: {
//     path: process.env.KEY,
//     isPreview: true
//   },
// } as any, {} as any)

handler({ 
  httpMethod: 'GET',
} as any, {} as any)