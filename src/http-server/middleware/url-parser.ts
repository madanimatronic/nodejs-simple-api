import { ExtendedIncomingMessage, Middleware } from '@/http-server/types';
import { UrlUtils } from '../UrlUtils';

export const urlParser =
  (baseURL: string, serverRoutes: string[]): Middleware =>
  (req, res, next) => {
    if (!req.url) throw new Error('req.url is missing!');

    const parsedURL = new URL(req.url, baseURL);

    const queryParams: ExtendedIncomingMessage['query'] = {};

    parsedURL.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });

    (req as ExtendedIncomingMessage).pathname = parsedURL.pathname;
    (req as ExtendedIncomingMessage).query = queryParams;
    (req as ExtendedIncomingMessage).params =
      UrlUtils.findPathParams(parsedURL.pathname, serverRoutes) ?? {};
    next();
  };
