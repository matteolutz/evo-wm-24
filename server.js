import { createRequestHandler } from '@remix-run/express';
import express from 'express';
import process from 'process';

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
app.use(
  viteDevServer ? viteDevServer.middlewares : express.static('build/client')
);

const build = viteDevServer
  ? () => viteDevServer.ssrLoadModule('virtual:remix/server-build')
  : await import('./build/server/index.js');

app.all('*', createRequestHandler({ build }));

app.listen(PORT, () => {
  console.log(`App listening on http://localhost:${PORT}`);
});
