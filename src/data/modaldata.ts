import { rememberCloseTabDecision } from './constants';

export type ModalData = {
  title: string;
  description: string;
  rememberActionKeyName: string;
  actionName: string;
}

export const closeMessageData: ModalData = {
  title: "Cerrar pestaña",
  description: "Al cerrar esta pestaña perderas el codigo en ella de manera permamente",
  actionName: "Cerrar pestaña",
  rememberActionKeyName: rememberCloseTabDecision
}
