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
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] z-[200]">
        <Keyboard
          onInit={(k) => k.setInput(htmlFor?.value ?? '')}
          onChange={handleChange.bind(this)}
          layout={{
            default: [
              '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
              'q w e r t y u i o p [ ] \\',
              "a s d f g h j k l ; ' {enter}",
              'z x c v b n m , . /',
              '{space}'
            ],
            shift: [
              '~ ! @ # $ % ^ & * ( ) _ + {bksp}',
              'Q W E R T Y U I O P { } |',
              'A S D F G H J K L : " {enter}',
              'Z X C V B N M < > ?',
              '{space}'
            ]
          }}
        />
      </div>
    )
  );
};

export default EvoKeyboard;
