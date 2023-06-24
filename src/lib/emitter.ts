import { EventEmitter } from "fbemitter";

const emitter = new EventEmitter();

export const newTabEventName = "newTab";
export const closeActiveTabEventName = "closeActiveTab";

export const emitNewTabEvent = () => {
    emitter.emit(newTabEventName);
}

export const emitCloseActiveTabEvent = (tabId: string) => {
    emitter.emit(closeActiveTabEventName, tabId);
}
