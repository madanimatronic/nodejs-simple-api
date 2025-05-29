import { IncomingMessage, ServerResponse } from 'http';

export type RouterEndpoints = Record<string, EndpointMethods>;

export type EndpointMethods = Record<HTTPMethod, HTTPMethodHandler>;

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type HTTPMethodHandler = (
  req: ExtendedIncomingMessage,
  res: ExtendedServerResponse,
) => void;

export type EndpointMask = `[${string}]:[${HTTPMethod}]`;

export type Middleware = (
  req: IncomingMessage,
  res: ServerResponse,
  next: NextFunction,
) => void;

export type NextFunction = () => void;

// middleware могут расширять функционал объектов запроса и ответа
export type ExtendedIncomingMessage = IncomingMessage & {
  pathname: string;
  query: Partial<Record<string, string>>;
  body: any;
  params: Partial<Record<string, string>>;
};

export type ExtendedServerResponse = ServerResponse & {
  status: (code: number) => ExtendedServerResponse;
  send: (data: any) => void;
};
