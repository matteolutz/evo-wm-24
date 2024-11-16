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
    if (!e.relatedTarget) return;
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

  return show && <Keyboard onChange={handleChange.bind(this)} />;
};

export default EvoKeyboard;
