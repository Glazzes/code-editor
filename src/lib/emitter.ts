import {EventEmitter, EventSubscription} from "fbemitter";
import {TabContent} from "../types/tabcontent";

type TabCallback = (newTab: TabContent) => void; 

const emitter = new EventEmitter();

export const closeActiveTabEventName = "closeActiveTab";

export const newTabEventName = "newTab";
export const addNewTabEventListener = (callback: TabCallback): EventSubscription => {
    return emitter.addListener(newTabEventName, callback);
}

export const emitNewTabEvent = (newTab: TabContent) => {
    emitter.emit(newTabEventName, newTab);
}

const updateActiveTabNameEventName = "updateActiveTabNameEventName";
type UpdateTabNameCallback = (tabId: string, name: string) => void;

export const registerUpdateActiveTabNameListener = (callback: UpdateTabNameCallback): EventSubscription => {
    return emitter.addListener(updateActiveTabNameEventName, callback);
}

export const emitUpdateTabNameEvent = (tadId: string, name: string) => {
    emitter.emit(updateActiveTabNameEventName, tadId, name);
}

const changeActiveTabEventName = "changeActiveTabEventName";
export const registerChangeActiveTabListener = (callback: (tabId: string) => void) => {
    return emitter.addListener(changeActiveTabEventName, callback);
}

export const emitChangeActiveTabEvent = (newActiveTabId: TabContent) => {
    emitter.emit(changeActiveTabEventName, newActiveTabId);
}
