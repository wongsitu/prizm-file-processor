import { handler } from "../src/services/prizm/handler";
require('dotenv').config()

handler({ 
  httpMethod: 'GET',
  queryStringParameters: {
    path: process.env.KEY,
    isPreview: true
  },
} as any, {} as any)

// handler({ 
//   httpMethod: 'PUT', 
//   queryStringParameters: {
//     id: '455079b1-bdb4-4378-860c-2cbd19a94101'
//   },
//   body: JSON.stringify({
//     location: 'Dublin'
//   })
// } as any, {} as any)

// handler({ 
//   httpMethod: 'DELETE', 
//   queryStringParameters: {
//     id: '455079b1-bdb4-4378-860c-2cbd19a94101'
//   },
// } as any, {} as any)