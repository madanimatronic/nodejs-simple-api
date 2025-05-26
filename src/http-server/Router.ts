import {
  EndpointMethods,
  HTTPMethod,
  HTTPMethodHandler,
  RouterEndpoints,
} from './types';

export class Router {
  readonly endpoints: RouterEndpoints = {};

  createEndpoint(
    path: string = '/',
    method: HTTPMethod = 'GET',
    handler: HTTPMethodHandler,
  ) {
    if (!path.startsWith('/') || path.endsWith('/')) {
      throw new Error(
        'Wrong path, it should start with "/" and NOT end with "/"',
      );
    }

    if (!this.endpoints[path]) {
      this.endpoints[path] = {} as EndpointMethods;
    }

    const endpoint = this.endpoints[path];

    if (endpoint[method]) {
      throw new Error(`${method} at path ${path} already exists!`);
    }

    endpoint[method] = handler;
  }

  get(path: string, handler: HTTPMethodHandler) {
    this.createEndpoint(path, 'GET', handler);
  }

  post(path: string, handler: HTTPMethodHandler) {
    this.createEndpoint(path, 'POST', handler);
  }

  put(path: string, handler: HTTPMethodHandler) {
    this.createEndpoint(path, 'PUT', handler);
  }

  delete(path: string, handler: HTTPMethodHandler) {
    this.createEndpoint(path, 'DELETE', handler);
  }
}
