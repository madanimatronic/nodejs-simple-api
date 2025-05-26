import { ExtendedServerResponse, Middleware } from '@/http-server/types';

export const responseExtender: Middleware = (req, res, next) => {
  // res, возвращаемый некоторыми методами как ExtendedServerResponse,
  // может не соответствовать данному типу в рамках этого middleware,
  // т.к. res расширяется постепенно

  (res as ExtendedServerResponse).status = (code: number) => {
    res.statusCode = code;
    return res as ExtendedServerResponse;
  };

  (res as ExtendedServerResponse).send = (data: any) => {
    res.writeHead(res.statusCode || 200, {
      'content-type': 'application/json',
    });
    res.end(JSON.stringify(data));
  };

  next();
};
