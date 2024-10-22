import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [{ title: 'evolut1on' }];
};

export default function Index() {
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
      </div>
    </div>
  );
}
