import {EventEmitter, EventSubscription} from "fbemitter";
import { ModalData } from "../data/modaldata";
import {TabContent} from "../types/tabcontent";

type TabCallback = (newTab: TabContent) => void; 
type GenericModalData = ModalData & {onPress: () => void};

const emitter = new EventEmitter();

const openNewTabModal = "open.new.tab.modal";
export const addOpenNewtbaModalListener = (callback: () => void): EventSubscription => {
    return emitter.addListener(openNewTabModal, callback);
}

export const emitOpenNewTabModalEvent = () => {
    emitter.emit(openNewTabModal);
}

const openGenericModal = "open.generic.modal";
export const addOpenGenericModalListener = (callback: (data: GenericModalData) => void): EventSubscription => {
    return emitter.addListener(openGenericModal, callback);
}

export const emitOpenGenericModalEvent = (data: GenericModalData) => {
    emitter.emit(openGenericModal, data);
}

const newTabEventName = "newTab";
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

const triggerFakeIntervalEventName = "trigger.fake.interval";
export const addTriggerFakeIntervalListener = (callback: () => void) => {
    return emitter.addListener(triggerFakeIntervalEventName, callback);
}

export const emitTriggerFakeIntervalEvent = () => {
    emitter.emit(triggerFakeIntervalEventName);
}
