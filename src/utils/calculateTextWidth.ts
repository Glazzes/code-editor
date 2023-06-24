type CalcTextWidthOptions = {
    text: string;
    font: string;
    sizePx: number;
}

export const calculateTextWidth = (options: CalcTextWidthOptions): number => {
  const text: HTMLSpanElement = document.createElement("span");
  document.body.appendChild(text);

  text.style.fontFamily = options.font,
  text.style.fontSize = `${options.sizePx + 1}px`;
  text.style.position = "absolute";
	text.style.top = "0";
  text.textContent = options.text;

  const textWidth = Math.ceil(text.clientWidth);
  document.body.removeChild(text);

  return textWidth;
}
