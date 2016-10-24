import React, { PropTypes } from 'react';
import { hashHistory, Route, Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import Frame from './Frame';
import Image from '../Image';
import Map from '../Map';
import Trade from '../Map/Trade';
import Disease from '../Map/Disease';

const Routes = (props, { store }) => (
  <Router history={syncHistoryWithStore(hashHistory, store)}>
    <Route path="/" component={Frame}>
      <Route path="image" component={Image} />
      <Route path="map" component={Map}>
        <Route path="trade" component={Trade} />
        <Route path="disease" component={Disease} />
      </Route>
    </Route>
  </Router>
);
Routes.contextTypes = {
  store: PropTypes.object.isRequired,
};
export default Routes;
