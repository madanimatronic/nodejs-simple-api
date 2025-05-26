import { ExtendedIncomingMessage, Middleware } from '@/http-server/types';

export const bodyParser: Middleware = (req, res, next) => {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    try {
      if (body) {
        (req as ExtendedIncomingMessage).body = JSON.parse(body);
      }
      next();
    } catch (err) {
      res.writeHead(400, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
  });

  req.on('error', (err) => {
    res.writeHead(500, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error: 'Error reading body' }));
  });
};
