import React, { FC, useContext, useRef, useState } from 'react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '../components/ui/alert-dialog';
import { Button, ButtonProps } from '../components/ui/button';

type UseModalShowReturnType = {
  show: boolean;
  setShow: (show: boolean) => void;
  onHide: () => void;
};

export const useModalShow = (): UseModalShowReturnType => {
  const [show, setShow] = useState(false);

  const onHide = () => setShow(false);

  return { show, setShow, onHide };
};

type InfoModalProps = {
  title: string | JSX.Element;
  message: string | JSX.Element;
};

type ModalContextType = {
  showInfo: (props: InfoModalProps) => void;
};

type InfoModalContextProviderProps = {
  children: React.ReactNode;
};

const InfoModalContext = React.createContext<ModalContextType>(
  {} as ModalContextType
);

const InfoModalContextProvider: FC<InfoModalContextProviderProps> = (props) => {
  const { show, setShow, onHide } = useModalShow();
  const [content, setContent] = useState<InfoModalProps | undefined>();

  const handleShow = (props: InfoModalProps): void => {
    setContent(props);
    setShow(true);
  };

  const modalContext: ModalContextType = {
    showInfo: handleShow
  };

  return (
    <InfoModalContext.Provider value={modalContext}>
      {props.children}
      <AlertDialog open={show} onOpenChange={(open) => !open && onHide()}>
        {content && (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{content.title}</AlertDialogTitle>
              <AlertDialogDescription>{content.message}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button onClick={onHide}>Ok</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
      </AlertDialog>
    </InfoModalContext.Provider>
  );
};

export const useInfoModalContext = (): ModalContextType =>
  useContext(InfoModalContext);

export default InfoModalContextProvider;
