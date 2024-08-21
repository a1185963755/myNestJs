import { z } from 'zod';

export const createUserSchema = z
  .object({
    id: z.number().optional(),
    name: z.string({
      invalid_type_error: 'name必须是字符串',
      required_error: 'name必填',
    }),
    age: z.number({
      invalid_type_error: 'age必须是数字',
      required_error: 'age必填',
    }),
    password: z.string(),
  })
  .strip();

export type CreateUserDto = z.infer<typeof createUserSchema>;
