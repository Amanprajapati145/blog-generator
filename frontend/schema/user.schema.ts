import { z } from "zod";

export const signupSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export type signupUser = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type loginUser = z.infer<typeof loginSchema>;
