import React, { PropTypes } from 'react';
import { hashHistory, Route, Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import Frame from './Frame';
import Map from '../Map';
import Trade from '../Map/Trade';

const Routes = (props, { store }) => (
  <Router history={syncHistoryWithStore(hashHistory, store)}>
    <Route path="/" component={Frame}>
      <Route path="map" component={Map}>
        <Route path="trade" component={Trade} />
      </Route>
    </Route>
  </Router>
);
Routes.contextTypes = {
  store: PropTypes.object.isRequired,
};
export default Routes;
