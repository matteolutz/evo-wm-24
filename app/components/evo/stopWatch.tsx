import { FC, HTMLProps, useEffect, useState } from 'react';

export type StopWatchProps = {
  startTime: number;
};

const StopWatch: FC<HTMLProps<HTMLDivElement> & StopWatchProps> = ({
  startTime,
  ...props
}) => {
  const [passed, setPassed] = useState(Date.now() - startTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setPassed(Date.now() - startTime);
    }, 10);

    return () => clearInterval(interval);
  });

  return <div {...props}>{passed.toFixed(2)}ms</div>;
};

export default StopWatch;
