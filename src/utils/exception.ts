import { HttpException, HttpStatus } from '@nestjs/common';

/** 错误返回 */
export class BaseException extends HttpException {
  constructor(response: string | object, status: HttpStatus) {
    super({ code: status, message: response }, status);
  }
}
