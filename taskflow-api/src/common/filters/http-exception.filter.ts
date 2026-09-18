import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface ValidationError {
  field: string;
  message: string;
}

interface ErrorResponse {
  statusCode: number;
  message: string;
  errors: ValidationError[] | null;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: ValidationError[] | null = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const resp = exceptionResponse as Record<string, unknown>;
        message = (resp['message'] as string) ?? exception.message;

        // Handle class-validator errors
        if (Array.isArray(resp['message'])) {
          message = 'Validation failed';
          errors = (resp['message'] as string[]).map((msg) => {
            const parts = msg.split(' ');
            const field = parts[0] ?? 'unknown';
            return { field, message: msg };
          });
        }
      }
    }

    const body: ErrorResponse = { statusCode: status, message, errors };
    response.status(status).json(body);
  }
}
