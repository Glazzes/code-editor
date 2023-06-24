import { EventEmitter, EventSubscription } from "fbemitter";
import { TabContent } from "../types/tabcontent";

const emitter = new EventEmitter();

export const newTabEventName = "newTab";
export const closeActiveTabEventName = "closeActiveTab";

export const emitNewTabEvent = (newTab: TabContent) => {
    emitter.emit(newTabEventName, newTab);
}

type NewTabCallback = (newTab: TabContent) => void; 
export const addNewTabEventListener = (callback: NewTabCallback): EventSubscription => {
    return emitter.addListener(newTabEventName, callback);
}

export const emitCloseActiveTabEvent = (tabId: string) => {
    emitter.emit(closeActiveTabEventName, tabId);
}
