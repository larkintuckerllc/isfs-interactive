const getColor = (i) => {
  const colors = [{
    r: 255, g: 0, b: 0,
  }, {
    r: 255, g: 128, b: 128,
  }, {
    r: 255, g: 127, b: 0,
  }, {
    r: 255, g: 255, b: 0,
  }, {
    r: 255, g: 255, b: 128,
  }, {
    r: 0, g: 255, b: 0,
  }, {
    r: 128, g: 255, b: 128,
  }, {
    r: 64, g: 64, b: 255,
  }, {
    r: 128, g: 0, b: 255,
  }, {
    r: 128, g: 128, b: 255,
  }];
  return (colors[i % colors.length]);
};
export default getColor;
