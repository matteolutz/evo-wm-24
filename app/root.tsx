import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from '@remix-run/react';

import './styles/tailwind.css';
import { Card } from './components/ui/card';
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert';
import { Button } from './components/ui/button';
import GlobalLoader from './components/evo/globalLoader';
import EvoLink from './components/evo/evoLink';
import { useEventSource } from 'remix-utils/sse/react';
import useNFCReaderId from './hooks/useNFCReaderId';
import { useEffect } from 'react';
import { NFCEmitterMessage } from './types/emitter';
import useEvoNavigate from './hooks/useEvoNavigate';
import { evoGradient } from './utils/gradient';
import CopyrightOverlay from './components/matteolutz/copyright';
import InfoModalContextProvider from './hooks/modal';

export const ErrorBoundary = () => {
  return (
    <Layout>
      <div className="w-screen h-screen">
        <div
          className="blueprint size-full flex flex-col items-center gap-8 p-8"
          style={{ backgroundImage: evoGradient(useNFCReaderId()) }}
        />
        <div className="absolute top-0 left-0 z-10 w-full h-full flex justify-center items-center flex-col gap-8 p-8">
          <Card className="p-8">
            <Alert variant="destructive" className="border-2">
              <AlertTitle>Oops! Something went wrong.</AlertTitle>
              <AlertDescription>
                <Button variant="link" asChild>
                  <EvoLink to="/">Take be back to evolut1on</EvoLink>
                </Button>
              </AlertDescription>
            </Alert>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="w-screen h-screen">
        <GlobalLoader />
        <InfoModalContextProvider>{children}</InfoModalContextProvider>
        <CopyrightOverlay />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const nfcReaderId = useNFCReaderId();
  const navigate = useEvoNavigate();

  const nfcMessage = useEventSource('/sse/nfc', { event: '' + nfcReaderId });

  useEffect(() => {
    if (!nfcMessage) return;

    const { message } = JSON.parse(nfcMessage) as {
      message: NFCEmitterMessage;
    };

    switch (message.type) {
      case 'navigate-to':
        navigate(message.to);
        break;
    }

    console.log(nfcMessage);
  }, [nfcMessage]);

  return <Outlet />;
}
