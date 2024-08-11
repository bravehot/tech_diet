import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;

    const userAgent = req.get('user-agent') || '';
    const params = JSON.stringify(req.params);
    const query = JSON.stringify(req.query);
    const body = JSON.stringify(req.body);

    const now = new Date();
    const log = `${now.toISOString()} | ${method} ${originalUrl} | IP: ${ip} | UserAgent: ${userAgent} | Params: ${params} | Query: ${query} | Body: ${body}\n`;
    console.log('log: ', log);

    // fs.appendFile('access.log', log, (err) => {
    //   if (err) {
    //     console.error('无法写入日志文件:', err);
    //   }
    // });

    next();
  }
}
