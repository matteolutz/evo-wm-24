import { FC, useEffect, useState } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

export type EvoKeyboardProps = {
  htmlFor: HTMLInputElement | null;
};

const EvoKeyboard: FC<EvoKeyboardProps> = ({ htmlFor }) => {
  const [show, setShow] = useState(false);

  const onInputFocus = setShow.bind(this, true);
  const onInputBlur = setShow.bind(this, false);

  useEffect(() => {
    if (!htmlFor) return;

    htmlFor.addEventListener('focus', onInputFocus);
    htmlFor.addEventListener('blur', onInputBlur);

    return () => {
      htmlFor.removeEventListener('focus', onInputFocus);
      htmlFor.removeEventListener('blur', onInputBlur);
    };
  }, [htmlFor]);

  return (
    show && (
      <div className="fixed bottom-0 left-0 w-full z-[2000]">
        <Keyboard />
      </div>
    )
  );
};

export default EvoKeyboard;
