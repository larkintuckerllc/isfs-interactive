import React, { PropTypes } from 'react';
import { hashHistory, IndexRoute, Route, Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import Frame from './Frame';
import Image from '../Image';
import Map from '../Map';
import Trade from '../Map/Trade';
import Disease from '../Map/Disease';
import Fisheries from '../Map/Fisheries';
import Saver from '../Saver';

const Routes = (props, { store }) => (
  <Router history={syncHistoryWithStore(hashHistory, store)}>
    <Route path="/" component={Frame}>
      <IndexRoute component={Saver} />
      <Route path="saver" component={Saver} />
      <Route path="image" component={Image} />
      <Route path="map" component={Map}>
        <Route path="trade" component={Trade} />
        <Route path="disease" component={Disease} />
        <Route path="fisheries" component={Fisheries} />
      </Route>
    </Route>
  </Router>
);
Routes.contextTypes = {
  store: PropTypes.object.isRequired,
};
export default Routes;
