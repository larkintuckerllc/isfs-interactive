import * as fromRest from '../util/rest';

// eslint-disable-next-line
export const post = (data) =>
  fromRest.dsPost('/api/mail', data);
