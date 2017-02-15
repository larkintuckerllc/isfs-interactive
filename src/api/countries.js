import * as fromRest from '../util/rest';

// eslint-disable-next-line
export const getCountries = () =>
  fromRest.getCollection('countries.json');
