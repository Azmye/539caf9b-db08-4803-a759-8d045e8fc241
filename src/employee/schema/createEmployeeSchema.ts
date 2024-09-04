import { z } from 'zod';

export const createEmployeeSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    position: z.string(),
    phone: z.string(),
    email: z.string().email('Invalid email'),
  })
  .required();

export type CreateEmployeeSchema = z.infer<typeof createEmployeeSchema>;
