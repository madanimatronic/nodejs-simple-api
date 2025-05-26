import {
  EndpointMask,
  ExtendedIncomingMessage,
  ExtendedServerResponse,
  HTTPMethod,
  Middleware,
} from '@/http-server/types';
import EventEmitter from 'events';
import http, { IncomingMessage, ServerResponse } from 'http';
import { Router } from './Router';
import { UrlUtils } from './UrlUtils';
import { bodyParser } from './middleware/body-parser';
import { responseExtender } from './middleware/response-extender';
import { urlParser } from './middleware/url-parser';

export class Server {
  private server = this.createServer();
  private emitter = new EventEmitter();
  private middlewares: Middleware[] = [];
  readonly routes: string[] = [];

  constructor(baseURL: string) {
    this.initBaseMiddlewares(baseURL);
  }

  private initBaseMiddlewares(baseURL: string) {
    this.use(responseExtender);
    this.use(bodyParser);
    this.use(urlParser(baseURL, this.routes));
  }

  use(middleware: Middleware) {
    this.middlewares.push(middleware);
  }

  addRouter(router: Router) {
    const endpoints = router.endpoints;
    Object.keys(endpoints).forEach((path) => {
      const methods = endpoints[path];
      (Object.keys(methods) as HTTPMethod[]).forEach((method) => {
        const handler = methods[method];
        const endpointMask = this.generateEndpointMask(path, method);

        this.routes.push(path);
        this.emitter.on(endpointMask, handler);
      });
    });
  }

  listen(port: number, callback: () => void) {
    this.server.listen(port, callback);
  }

  private createServer() {
    return http.createServer((req, res) => {
      this.executeMiddlewares(req, res, () => {
        // После выполнения всех middleware, функционал req и res расширен
        this.handleRequest(
          req as ExtendedIncomingMessage,
          res as ExtendedServerResponse,
        );
      });
    });
  }

  private executeMiddlewares(
    req: IncomingMessage,
    res: ServerResponse,
    onFinished?: () => void,
  ) {
    let index = 0;

    const next = () => {
      if (index < this.middlewares.length) {
        const middleware = this.middlewares[index++];
        try {
          middleware(req, res, next);
        } catch (err) {
          res.writeHead(500, { 'content-type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
          console.error(err);
        }
      } else {
        // middleware кончились, вызываем callback
        onFinished?.();
      }
    };

    next();
  }

  private handleRequest(
    req: ExtendedIncomingMessage,
    res: ExtendedServerResponse,
  ) {
    const endpointMask = this.generateEndpointMask(
      UrlUtils.findPathTemplate(req.pathname, this.routes) || req.pathname,
      (req.method as HTTPMethod) || 'GET',
    );
    const endpointExists = this.emitter.emit(endpointMask, req, res);
    if (!endpointExists) {
      this.handleUnknownEndpoint(req, res);
    }
  }

  private handleUnknownEndpoint(
    req: ExtendedIncomingMessage,
    res: ExtendedServerResponse,
  ) {
    res.status(404).send({ error: 'Unknown endpoint' });
  }

  private generateEndpointMask(path: string, method: HTTPMethod): EndpointMask {
    return `[${path}]:[${method}]`;
  }
}
