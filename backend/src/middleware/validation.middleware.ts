import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export const validateData =
  (schema: z.ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: error.issues[0]?.message || "Validation error" });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  };
