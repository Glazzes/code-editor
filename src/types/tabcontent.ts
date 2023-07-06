import { Language } from "./language";

export type TabContent = {
  id: string;
  name: string;
  language: Language
  code: string,
  lastExecution: {
    code: string[];
    elapsedTime: number;
  };
}
