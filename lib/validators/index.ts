import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Validate and parse request body using Zod schema
 */
export async function validateBody<T extends z.ZodTypeAny>(
  req: NextRequest,
  schema: T
): Promise<[z.infer<T> | null, NextResponse | null]> {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    return [data, null];
  } catch (error) {
    if (error instanceof z.ZodError) {
      return [
        null,
        NextResponse.json(
          { error: 'Validation error', details: error.errors },
          { status: 400 }
        ),
      ];
    }
    
    return [
      null,
      NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      ),
    ];
  }
}

/**
 * Validate and parse request query parameters using Zod schema
 */
export function validateQuery<T extends z.ZodTypeAny>(
  req: NextRequest,
  schema: T
): [z.infer<T> | null, NextResponse | null] {
  try {
    const url = new URL(req.url);
    const queryParams: Record<string, string> = {};
    
    url.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });
    
    const data = schema.parse(queryParams);
    return [data, null];
  } catch (error) {
    if (error instanceof z.ZodError) {
      return [
        null,
        NextResponse.json(
          { error: 'Validation error', details: error.errors },
          { status: 400 }
        ),
      ];
    }
    
    return [
      null,
      NextResponse.json(
        { error: 'Invalid query parameters' },
        { status: 400 }
      ),
    ];
  }
} 