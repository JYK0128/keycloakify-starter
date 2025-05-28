import { createContext, ReactNode, useContext } from 'react';

export const DIALOG = {
  ALERT: 'alert',
  CONFIRM: 'confirm',
  ERROR: 'error',
} as const;
export type DIALOG = typeof DIALOG[keyof typeof DIALOG];


export type DialogParams<DATA = unknown> = {
  type: DIALOG
  title?: string
  description: ReactNode
  result?: DATA
};
export type DialogContext = {
  run: <DATA = undefined>(params: DialogParams<DATA>) => Promise<DATA extends undefined ? boolean : DATA>
};


export const DialogContext = createContext<Nullable<DialogContext>>(null);
export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('dialog must be used within an DialogProvider.');
  }
  return context;
};
