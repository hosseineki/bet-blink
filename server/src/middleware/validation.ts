import { Context, Next } from 'hono';
import { ZodSchema, ZodError } from 'zod';

export function validateBody<T>(schema: ZodSchema<T>) {
  return async (c: Context, next: Next) => {
    try {
      const body = await c.req.json();
      const validatedData = schema.parse(body);
      
      // Store validated data in context
      c.set('validatedData', validatedData);
      
      await next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {};
        
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          if (!errors[path]) {
            errors[path] = [];
          }
          errors[path].push(err.message);
        });

        return c.json({
          success: false,
          message: 'Validation failed',
          errors,
        }, 400);
      }

      return c.json({
        success: false,
        message: 'Invalid request body',
      }, 400);
    }
  };
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return async (c: Context, next: Next) => {
    try {
      const query = c.req.query();
      const validatedData = schema.parse(query);
      
      // Store validated data in context
      c.set('validatedQuery', validatedData);
      
      await next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {};
        
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          if (!errors[path]) {
            errors[path] = [];
          }
          errors[path].push(err.message);
        });

        return c.json({
          success: false,
          message: 'Query validation failed',
          errors,
        }, 400);
      }

      return c.json({
        success: false,
        message: 'Invalid query parameters',
      }, 400);
    }
  };
}
