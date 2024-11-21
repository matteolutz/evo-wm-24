import { FC, useEffect, useState } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

export type EvoKeyboardProps = {
  htmlFor: HTMLInputElement | null;
};

const EvoKeyboard: FC<EvoKeyboardProps> = ({ htmlFor }) => {
  const [show, setShow] = useState(false);

  const onInputFocus = setShow.bind(this, true);
  const onInputBlur = (e: FocusEvent) => {
    console.log(e);
    setShow(false);
  };

  useEffect(() => {
    if (!htmlFor) return;

    htmlFor.addEventListener('focus', onInputFocus);
    htmlFor.addEventListener('blur', onInputBlur);

    return () => {
      htmlFor.removeEventListener('focus', onInputFocus);
      htmlFor.removeEventListener('blur', onInputBlur);
    };
  }, [htmlFor]);

  const handleChange = (value: string, e?: MouseEvent) => {
    e?.preventDefault();

    if (htmlFor) {
      htmlFor.value = value;
    }
  };

  return (
    show && (
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] z-[200]">
        <Keyboard
          onInit={(k) => k.setInput(htmlFor?.value ?? '')}
          onChange={handleChange.bind(this)}
        />
      </div>
    )
  );
};

export default EvoKeyboard;
