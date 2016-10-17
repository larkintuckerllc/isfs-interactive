let dimensions;
let shiftTop;
let shiftLeft;
let hpos;
let vpos;
let contentWidth;
let contentHeight;
let frameWidth;
let frameHeight;
// eslint-disable-next-line
export const grid = (channel, frameEl, contentEl, matrix, d) => {
  if (channel === undefined || typeof channel !== 'number') throw new Error();
  if (frameEl === undefined || typeof frameEl !== 'object') throw new Error();
  if (contentEl === undefined || typeof contentEl !== 'object') throw new Error();
  if (matrix === undefined || !Array.isArray(matrix)) throw new Error();
  if (d === undefined || !Array.isArray(d)) throw new Error();
  const modFrameEl = frameEl;
  const modContentEl = contentEl;
  shiftTop = 0;
  contentWidth = 0;
  contentHeight = 0;
  dimensions = d;
  for (let i = 0; i < matrix.length; i++) {
    contentWidth = Math.max(
      (dimensions[i].scale * dimensions[i].width * matrix[i].length) + // FRAMES
      (dimensions[i].padding * 2 * dimensions[i].scale) + // PADDING
      (dimensions[i].spacing * (matrix[i].length - 1) * dimensions[i].scale), // SPACING
      contentWidth);
    contentHeight += (dimensions[i].scale * dimensions[i].height) +
      (dimensions[i].scale * dimensions[i].margin);
    for (let j = 0; j < matrix[i].length; j++) {
      if (channel === matrix[i][j]) {
        hpos = j;
        vpos = i;
      }
    }
  }
  frameWidth = dimensions[vpos].scale * dimensions[vpos].width;
  frameHeight = dimensions[vpos].scale * dimensions[vpos].height;
  modFrameEl.style.width = `${frameWidth}px`;
  modFrameEl.style.height = `${frameHeight}px`;
  const tX = (dimensions[vpos].width * (1 - dimensions[vpos].scale)) / 2;
  const tY = (dimensions[vpos].height * (1 - dimensions[vpos].scale)) / 2;
  const sXY = 1 / dimensions[vpos].scale;
  modFrameEl.style.transform = `translate(${tX}px,${tY}px) scale(${sXY},${sXY})`;
  modContentEl.style.width = `${contentWidth}px`;
  modContentEl.style.height = `${contentHeight}px`;
  for (let i = 0; i < vpos; i++) {
    shiftTop += (dimensions[i].scale * dimensions[i].height) +
      (dimensions[i].scale * dimensions[i].margin);
  }
  const shiftLeftPadding = dimensions[vpos].padding * dimensions[vpos].scale;
  const shiftLeftWindows = hpos * dimensions[vpos].scale * dimensions[vpos].width;
  const shiftLeftSpacing = hpos * dimensions[vpos].spacing * dimensions[vpos].scale;
  shiftLeft = shiftLeftPadding + shiftLeftWindows + shiftLeftSpacing;
  modContentEl.style.left = `-${shiftLeft}px`;
  modContentEl.style.top = `-${shiftTop}px`;
};
export const frameXYToContentXY = coordinates => {
  if (coordinates === undefined ||
    !Array.isArray(coordinates) ||
    coordinates.length !== 2 ||
    coordinates[0] === undefined ||
    coordinates[1] === undefined ||
    typeof coordinates[0] !== 'number' ||
    typeof coordinates[1] !== 'number'
  ) {
    throw new Error();
  }
  return [
    (coordinates[0] * dimensions[vpos].scale) + shiftLeft,
    (coordinates[1] * dimensions[vpos].scale) + shiftTop,
  ];
};
export const getContentWidth = () => contentWidth;
export const getContentHeight = () => contentHeight;
export const getFrameWidth = () => frameWidth;
export const getFrameHeight = () => frameHeight;
export const getScale = () => dimensions[vpos].scale;
