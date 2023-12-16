import { randomUUID } from 'crypto'
import { z } from 'zod'

export const PostSchema = z.object({
  name: z.string(),
  location: z.string(),
  photoUrl: z.string().optional(),
})

export const CreatePostSchema = PostSchema.transform((data) => ({
  ...data,
  id: randomUUID(),
}))

export const UpdatePostSchema = PostSchema.partial()

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


export const fieldSchema = z.discriminatedUnion('format', [MultiSchema, UniqueSchema, NonResidentialSchema]);