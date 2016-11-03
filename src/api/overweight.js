import * as fromRest from '../util/rest';

// eslint-disable-next-line
export const getCollection = () =>
  fromRest.getCollection('overweight/database.json');
