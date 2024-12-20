/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import { PassThrough } from 'node:stream';

import type { AppLoadContext, EntryContext } from '@remix-run/node';
import { createReadableStreamFromReadable } from '@remix-run/node';
import { RemixServer } from '@remix-run/react';
import { isbot } from 'isbot';
import { renderToPipeableStream } from 'react-dom/server';
import { reactionEmitter } from './services/emitter.server';
import { SerialReactionTest } from './services/serial.server';
import { ReactionEmitterMessage } from './types/emitter';
import { SerialPort } from 'serialport';
import { globalServerState } from './services/state.server';
import { ALL_TEAMS } from './utils/teams';
import { REACTION_TEST_QUEUE_TIMEOUT_SECONDS } from './utils/constants';
import * as childProccess from 'child_process';
import { db } from './services/db.server';

const ABORT_DELAY = 5_000;
const USE_SERIAL = !process.env.DISABLE_SERIAL;
const SERIAL_PORT = process.env.SERIAL_PORT;
const REACTION_LEADERBOARD_DEBUG = !!process.env.REACTION_LEADERBOARD_DEBUG;

const randomString = (n: number) =>
  [...Array(n)].map(() => Math.random().toString(36)[2]).join('');

export let serial: SerialReactionTest | undefined;

console.log('[EVO-PIT] Starting server...');
try {
  childProccess.exec(
    'git rev-parse HEAD && git log -1 --format=%cd',
    (err, stdout) =>
      err === null &&
      console.log(`[EVO-PIT] Last commit info: ${stdout.trim()}`)
  );
} catch {
  /* empty */
}

USE_SERIAL &&
  (async () => {
    const port =
      SERIAL_PORT ||
      (await SerialPort.list()).find(
        (p) =>
          p.manufacturer &&
          typeof p.manufacturer === 'string' &&
          p.manufacturer.includes('Arduino')
      ).path;

    console.log(`[EVO-PIT][SERIAL] Using serial port: ${port}..`);

    serial = new SerialReactionTest(port);
    serial.addStateChangeListener((state) => {
      switch (state.state) {
        case 'running':
          reactionEmitter.emit(
            'message',
            globalServerState.currentReactionTest.user
              ? {
                  type: 'reaction-test-started',
                  user: globalServerState.currentReactionTest.user
                }
              : ({
                  type: 'reaction-test-started-standalone'
                } satisfies ReactionEmitterMessage)
          );
          break;
        case 'finished': {
          if (
            !globalServerState.currentReactionTest.user ||
            Date.now() - globalServerState.currentReactionTest.lastUpdated >
              REACTION_TEST_QUEUE_TIMEOUT_SECONDS * 1_000
          ) {
            globalServerState.currentReactionTest = {
              user: undefined,
              lastUpdated: Date.now()
            };

            reactionEmitter.emit('message', {
              type: 'reaction-test-finished-standalone'
            } satisfies ReactionEmitterMessage);
            break;
          }

          const timeEntry = {
            username: globalServerState.currentReactionTest.user.name,
            team: globalServerState.currentReactionTest.user.teamName,
            // save the time in seconds
            time: state.timeInMicros / 1_000_000.0,
            createdAt: Date.now()
          };

          // user finished the reaction test, publish it
          db.update(({ reactionTimes }) => {
            reactionTimes.push(timeEntry);
          })!;

          globalServerState.currentReactionTest = {
            user: undefined,
            lastUpdated: Date.now()
          };

          reactionEmitter.emit('message', {
            type: 'reaction-test-finished',
            timeEntry
          } satisfies ReactionEmitterMessage);
          break;
        }
        case 'failed':
          globalServerState.currentReactionTest = {
            user: undefined,
            lastUpdated: Date.now()
          };

          reactionEmitter.emit('message', {
            type: 'reaction-test-failed'
          } satisfies ReactionEmitterMessage);
          break;
        case 'lights-out':
          if (!globalServerState.currentReactionTest.user) break;
          reactionEmitter.emit('message', {
            type: 'reaction-test-lights-out',
            user: globalServerState.currentReactionTest.user
          } satisfies ReactionEmitterMessage);
          break;
      }
    });
  })();

const tick = () => {
  db.update(({ reactionTimes }) => {
    reactionTimes.push({
      username: randomString(5),
      time: Math.random(),
      team: ALL_TEAMS[Math.floor(Math.random() * ALL_TEAMS.length)].name,
      createdAt: Date.now()
    });
  });

  reactionEmitter.emit('message', {
    type: 'update-leaderboard'
  } satisfies ReactionEmitterMessage);
};

REACTION_LEADERBOARD_DEBUG && setInterval(tick, 5000);

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  // This is ignored so we can keep it in the template for visibility.  Feel
  // free to delete this parameter in your app if you're not using it!
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loadContext: AppLoadContext
) {
  return isbot(request.headers.get('user-agent') || '')
    ? handleBotRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext
      )
    : handleBrowserRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext
      );
}

function handleBotRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      <RemixServer
        context={remixContext}
        url={request.url}
        abortDelay={ABORT_DELAY}
      />,
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set('Content-Type', 'text/html');

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      <RemixServer
        context={remixContext}
        url={request.url}
        abortDelay={ABORT_DELAY}
      />,
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set('Content-Type', 'text/html');

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

process.on('SIGINT', () => {
  console.log('Exiting...');
  process.exit(0);
});
