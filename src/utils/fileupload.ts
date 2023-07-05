export const readCodeFileContents = (
  onSuccess: (content: string) => void,
  onError?: (error: string) => void
) => {
  const input: HTMLInputElement = document.createElement("input");
  input.type = "file";
  input.style.position = "absolute";
  input.style.bottom= "-100px";

  document.body.appendChild(input);
  input.click();

  input.addEventListener("change", function() {
    const reader = new FileReader();
    reader.addEventListener("load", function() {
      const text = this.result as string;
      onSuccess(text);

      document.body.removeChild(input);
    });

    reader.addEventListener("error", function(e) {
      const error: string = e.target?.error?.message ?? "Unkown error";
      if(onError) onError(error);

      document.body.removeChild(input);
    });

    const file = this.files?.[0];
    if(file) {
      if(file.type.startsWith("text")) {
        reader.readAsText(file);
      }else{
        if(onError) onError("Uploaded file is not a text file");
      }
    }
  });
}
