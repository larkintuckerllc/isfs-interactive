const fakeDatabase = {
  collection: [{
    id: 'chinook_salmon',
    latlng: [40, -125],
  }, {
    id: 'dungeness_crab',
    latlng: [38.5, -124.25],
  }],
};
const delay = (ms) =>
  new Promise(resolve => window.setTimeout(resolve, ms));
// eslint-disable-next-line
export const getCollection = () =>
  delay(1000).then(() =>
    fakeDatabase.collection.map(o => ({ ...o }))
  );
