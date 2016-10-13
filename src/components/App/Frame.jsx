import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getChannel } from 'thr0w-client-module/lib/ducks/channel';
import { grid } from 'thr0w-client-module/lib/grid';
import { MATRIX, DIMENSIONS } from '../../config';

class Frame extends Component {
  componentWillMount() {
    const { channel } = this.props;
    const frameEl = document.getElementById('frame');
    const frameContentEl = document.getElementById('frame__content');
    grid(channel, frameEl, frameContentEl, MATRIX, DIMENSIONS);
  }
  render() {
    const { children } = this.props;
    return children;
  }
}
Frame.propTypes = {
  channel: PropTypes.number.isRequired,
  children: PropTypes.node,
};
export default connect(
  state => ({
    channel: getChannel(state),
  }),
  null
)(Frame);
