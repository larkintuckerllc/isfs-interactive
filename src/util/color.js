const getColor = (i) => {
  const colors = [{
    r: 255, g: 102, b: 0,
  }, {
    r: 255, g: 0, b: 204,
  }, {
    r: 153, g: 0, b: 255,
  }, {
    r: 0, g: 204, b: 255,
  }, {
    r: 51, g: 255, b: 153,
  }, {
    r: 255, g: 204, b: 204,
  }, {
    r: 255, g: 0, b: 0,
  }, {
    r: 0, g: 0, b: 255,
  }, {
    r: 0, g: 204, b: 0,
  }, {
    r: 255, g: 255, b: 0,
  }];
  return (colors[i % colors.length]);
};
export default getColor;
