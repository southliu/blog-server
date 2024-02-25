import { BadRequestException, ParseIntPipe } from '@nestjs/common';
import * as crypto from 'crypto';

export function generateParseIntPipe(name: string) {
  return new ParseIntPipe({
    exceptionFactory() {
      throw new BadRequestException(`${name} 应该传数字`);
    },
  });
}

export function handleDate(date: Date, split = '/') {
  const currentDate = new Date(date);

  const year = currentDate.getFullYear(); //年份
  const month = currentDate.getMonth() + 1; // 月份
  const dates = currentDate.getDate(); // 日

  let hour: number | string = currentDate.getHours(); // 时
  hour = hour > 9 ? hour : '0' + hour;
  let minutes: number | string = currentDate.getMinutes(); // 分
  minutes = minutes > 9 ? minutes : '0' + minutes;
  let seconds: number | string = currentDate.getSeconds(); // 秒
  seconds = seconds > 9 ? seconds : '0' + seconds;

  // 结果：今天是:2022年10月16日 星期日
  return `${year}${split}${month}${dates} ${hour}:${minutes}:${seconds}`;
}

export function md5(str: string) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}
