const fakeDatabase = {
  collection: [{
    id: 'chinook_salmon',
    latlng: [40, -125],
    title: 'Chinook Salmon',
    ecology: 2.88,
    economic: 3.33,
    community: 3.88,
  }, {
    id: 'dungeness_crab',
    latlng: [38.5, -124.25],
    title: 'Dungeness Crab',
    ecology: 4.13,
    economic: 3.49,
    community: 3.98,
  }],
};
const delay = (ms) =>
  new Promise(resolve => window.setTimeout(resolve, ms));
// eslint-disable-next-line
export const getCollection = () =>
  delay(1000).then(() =>
    fakeDatabase.collection.map(o => ({ ...o }))
  );
