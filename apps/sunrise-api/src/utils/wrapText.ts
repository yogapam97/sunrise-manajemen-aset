export default function wrapText(
  context: any,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";

  for (let n = 0; n < words.length; n + 1) {
    const testLine = `${line + words[n]} `;
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(`${line}\n`, x, y);
      line = `${words[n]} `;
      y += lineHeight - 3;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}
