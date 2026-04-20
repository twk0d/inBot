import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ZodValidationException } from 'nestjs-zod';
import { v4 as uuidv4 } from 'uuid';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : exception instanceof ZodValidationException
        ? 422
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const requestId = (request as any).id || uuidv4();
    const timestamp = new Date().toISOString();

    let code = 'INTERNAL_SERVER_ERROR';
    let message = 'An unexpected error occurred';
    let details: any = undefined;

    if (exception instanceof HttpException) {
      const res = exception.getResponse() as any;
      code = res.error || 'HTTP_ERROR';
      message = res.message || exception.message;
    } else if (exception instanceof ZodValidationException) {
      const zodException = exception as ZodValidationException;
      code = 'VALIDATION_ERROR';
      message = 'Validation failed';
      details = (exception as any).getZodError().flatten().fieldErrors;
    } else if (exception.code === 'P2002') {
      // Prisma duplicate key
      code = 'CONFLICT';
      message = 'Resource already exists';
      const target = (exception as any).meta?.target;
      details = { target };
    } else {
      this.logger.error(`Unhandled exception: ${exception.message}`, exception.stack);
    }

    const errorResponse = {
      code,
      message,
      details,
      requestId,
      timestamp,
    };

    response.status(status).json(errorResponse);
  }
}
