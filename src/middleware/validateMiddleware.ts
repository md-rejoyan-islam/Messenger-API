import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodEffects } from 'zod';

const validate =
  (schema: AnyZodObject | ZodEffects<AnyZodObject>) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });
      // unrrecognized keys will be ignored
      // if you want to throw an error for unrecognized keys, use strict() method
      req.body = parsedData.body;

      return next();
    } catch (error) {
      next(error);
    }
  };

export default validate;
