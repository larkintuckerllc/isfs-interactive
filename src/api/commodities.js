import * as fromRest from '../util/rest';

// eslint-disable-next-line
export const getCommodities = () =>
  fromRest.getCollection('commodities.json');
