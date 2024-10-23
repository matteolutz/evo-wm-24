import type { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { useEffect } from 'react';
import { wsConnect } from '~/ws.client';

export const meta: MetaFunction = () => {
  return [{ title: 'evolut1on' }];
};

export default function Index() {
  useEffect(() => {
    const conn = wsConnect();
    console.log(conn);
  }, []);

  return (
    <div className="w-screen h-screen">
      <div className="blueprint size-full bg-evo-orange">
        <div className="absolute top-0 left-0 w-full p-8 flex flex-col gap-2">
          <img
            src="/assets/svg/evolut1on-fullwhite_2.svg"
            className="max-w-[20rem] w-1/4"
            alt=""
          />
          <h1>World Finals Saudi-Arabia 24</h1>
        </div>
        <div className="absolute top-0 left-0 z-10 w-full h-full flex justify-center items-center">
          <Link to="/reaction">Reaction</Link>
        </div>
      </div>
    </div>
  );
}
