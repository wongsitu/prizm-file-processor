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