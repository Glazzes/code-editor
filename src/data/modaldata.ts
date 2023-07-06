import { clearTabCodeKey, rememberCloseTabDecisionKey } from './constants';

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
  rememberActionKeyName: rememberCloseTabDecisionKey
}

export const clearTabCodeData: ModalData = {
  title: "Limpiar pestaña",
  description: "Estas a punto de eliminar todo el codigo en esta pestaña",
  actionName: "Limpiar codigo",
  rememberActionKeyName: clearTabCodeKey
}
