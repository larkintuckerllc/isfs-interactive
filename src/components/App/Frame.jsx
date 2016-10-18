import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getChannel } from '../../ducks/channel';
import { grid } from '../../util/grid';
import { getMatrix, getDimensions, valid } from '../../util/mode';

class Frame extends Component {
  componentWillMount() {
    const { channel } = this.props;
    if (!valid(channel)) return;
    const frameEl = document.getElementById('frame');
    const frameContentEl = document.getElementById('frame__content');
    grid(channel, frameEl, frameContentEl, getMatrix(), getDimensions());
  }
  render() {
    const { channel, children } = this.props;
    if (!valid(channel)) return null;
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
