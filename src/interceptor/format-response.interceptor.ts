import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { catchError, map, Observable, throwError } from 'rxjs';
import { BaseException } from 'src/utils/exception';

interface ErrorData {
  response: string;
  stack: string;
}

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(FormatResponseInterceptor.name);

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
      catchError((err: ErrorData) => {
        this.logger.error(err.response, err.stack);

        // 邮箱处理
        if (
          String(err.response)?.includes(
            'The recipient may contain a non-existent account, please check the recipient address.',
          )
        ) {
          const message = '收件人可能包含不存在的帐户，请检查收件人地址';
          return throwError(
            () => new BaseException(message, HttpStatus.INTERNAL_SERVER_ERROR),
          );
        }

        return throwError(
          () =>
            new BaseException(
              err.response || err,
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
        );
      }),
    );
  }
}
