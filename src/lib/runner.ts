import {Language} from "../types/language";

type CodeResult = {
  Output: string[]
}

export const runCode = async (language: Language, codeAsText: string): Promise<CodeResult> => {
  const code = codeAsText.split("\n");
  const body = {language, code}

  try{
    const res = await fetch("http://129.148.58.84:8080/api/run", {
      method: "POST",
      body: JSON.stringify(body)
    });

    const data = await res.json();
    return data;
  }catch(e) {
    return Promise.reject("Could not run code");
  }
}
