import { FC } from 'react';

const CopyrightOverlay: FC = () => {
  return (
    <div className="absolute right-0 bottom-0 px-2">
      <span className="text-xs text-muted">© 2024 evolut1on, Matteo Lutz</span>
    </div>
  );
};

export default CopyrightOverlay;
