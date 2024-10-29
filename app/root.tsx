import {
  Link,
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

export const ErrorBoundary = () => {
  return (
    <Layout>
      <div className="w-screen h-screen">
        <div className="blueprint size-full bg-evo-orange flex flex-col items-center gap-8 p-8"></div>
        <div className="absolute top-0 left-0 z-10 w-full h-full flex justify-center items-center flex-col gap-8 p-8">
          <Card className="p-8">
            <Alert variant="destructive" className="border-2">
              <AlertTitle>Oops! Something went wrong</AlertTitle>
              <AlertDescription>
                <Button variant="link" asChild>
                  <Link to="/">Take be back to evolut1on</Link>
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
      <body>
        <GlobalLoader />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
