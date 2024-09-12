import { z } from 'zod';

export const createUserSchema = z
  .object({
    id: z.number().optional(),
    username: z.string({
      invalid_type_error: 'username必须是字符串',
    }),
    password: z.string().min(6, {
      message: '密码长度不能小于6位',
    }),
  })
  .strip();

export type CreateUserDto = z.infer<typeof createUserSchema>;
