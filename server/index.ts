import { createRequestHandler } from '@remix-run/express';
import { ServerBuild } from '@remix-run/node';
import express from 'express';
import process from 'process';
import * as io from 'socket.io';
import http from 'http';

const PORT = Number(process.env.PORT || '') || 3000;

const viteDevServer =
  process.env.NODE_ENV === 'production'
    ? null
    : await import('vite').then((vite) =>
        vite.createServer({
          server: { middlewareMode: true }
        })
      );

const app = express();
const httpServer = http.createServer(app);

app.use(
  viteDevServer ? viteDevServer.middlewares : express.static('build/client')
);

// Hide the fact, that we're using express :)
app.disable('x-powered-by');

const build = viteDevServer
  ? () => viteDevServer.ssrLoadModule('virtual:remix/server-build')
  : await import('../build/server/remix.js');

app.all(
  '*',
  createRequestHandler({ build: build as () => Promise<ServerBuild> })
);

// Socket
const socketServer = new io.Server(httpServer);
socketServer.on('connection', (socket) =>
  console.log(`Socket connection: ${socket.id}`)
);

httpServer.listen(PORT, () => {
  console.log(`App listening on http://localhost:${PORT}`);
});
