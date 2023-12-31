import { APIGatewayProxyResult } from "aws-lambda";
import { GetSegmentSchema, JSONError } from "./Validators";
import axios from "axios";

export function parseJSON<T>(json: string): T {
  try {
    return JSON.parse(json);
  } catch (e: any) {
    throw new JSONError(e.message);
  }
}

export function addCORSHeaders(arg: APIGatewayProxyResult) {
  if (!arg.headers) {
    arg.headers = {}
  }
  arg.headers['Access-Control-Allow-Origin'] = '*'
  arg.headers['Access-Control-Allow-Methods'] = '*'
}

export const PRIZM_API = axios.create({
  baseURL: process.env.PRIZM_URL,
});

export const getPRIZMCode = async (postalCode: string) => {
  return PRIZM_API.get('https://prizm.environicsanalytics.com/api/pcode/get_segment', { params: { postal_code: postalCode } })
    .then((response) => {
      const data = GetSegmentSchema.safeParse(response.data)

      if (!data.success) {
        return generateRandomNumber(1, 67)
      }

      return data.data
    })
};

export const generateRandomNumber = (min: number, max: number) => {
  const randomFraction = Math.random();
  return Math.floor(randomFraction * (max - min + 1)) + min;
}

export type RowType = {
  StoreID: string;
  Customer_ID: string;
  'Postal Code': string;
  Total_Visits: `${number}`,
  'Dollars Spend': `${number}`,
  'Product Type': string;
}

export type PrizmRowType = RowType & {
  prizmId?: number | null;
}