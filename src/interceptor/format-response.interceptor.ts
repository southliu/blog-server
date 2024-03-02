import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();
    let statusCode = response.statusCode;

    if ([201, 202].includes(statusCode)) {
      statusCode = 200;
    }

    return next.handle().pipe(
      map((data) => {
        return {
          code: statusCode,
          message: 'success',
          data,
        };
      }),
    );
  }
}
