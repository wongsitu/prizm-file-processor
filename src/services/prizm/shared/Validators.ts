import { z } from 'zod'
import { generateRandomNumber } from './Utils'

export class JSONError extends Error {}

export const MultiSchema = z.object({
  result: z.literal('success'),
  data: z.array(
    z.object({
      postal_code: z.string(),
      title: z.string(),
      prizm_id: z.number(),
      id: z.string()
    })
  ),
  format: z.literal('multi'),
})

export const UniqueSchema = z.object({
  result: z.literal('success'),
  data: z.number(),
  format: z.literal('unique'),
})

export const NonResidentialSchema = z.object({
  result: z.literal('error'),
  data: z.string(),
  format: z.literal('non_residential_zoning'),
})

export const InvalidPCodeSchema = z.object({
  result: z.literal('error'),
  data: z.string(),
  format: z.literal('invalid_pcode'),
})

export const PostalCodeValidator = z.string().refine((value) => /^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/.test(value), {
  message: 'Invalid format. It should be <letter><number><letter><number><letter><number>',
});

export const GetSegmentSchema = z.discriminatedUnion('format', [MultiSchema, UniqueSchema, NonResidentialSchema, InvalidPCodeSchema]).transform((data) => {
  if (data.format === 'multi') {
    return data.data[0].prizm_id
  }
  if (data.format === 'unique') {
    return data.data
  }
  if (data.format === 'non_residential_zoning') {
    return null
  }
  if (data.format === 'invalid_pcode') {
    return -1
  }
  return generateRandomNumber(1, 67)
});

export const ProcessSchema = z.object({
  path: z.string()
})