import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as fromChannel from '../../ducks/channel';
import * as fromConnected from '../../ducks/connected';

class Connect extends Component {
  componentDidMount() {
    const { disconnect, thr0wConnect, removeChannel } = this.props;
    let connecting = true;
    const repeat = () => {
      if (!connecting) return;
      thr0wConnect()
      .then(
        () => {
          connecting = false;
        },
        error => {
          if (error.name !== 'Thr0wException') {
            window.console.log(error);
            return;
          }
          window.setTimeout(repeat, 5000);
        }
      );
    };
    const checkEsc = (e) => {
      if (e.keyCode !== 192) return true;
      const frameEl = document.getElementById('frame');
      const frameContentEl = document.getElementById('frame__content');
      document.removeEventListener('keydown', checkEsc);
      frameContentEl.style.width = '100%';
      frameContentEl.style.height = '100%';
      frameContentEl.style.left = '0px';
      frameContentEl.style.top = '0px';
      frameEl.style.width = '100%';
      frameEl.style.height = '100%';
      frameEl.style.transform = '';
      connecting = false;
      removeChannel();
      disconnect();
      return false;
    };
    document.addEventListener('keydown', checkEsc);
    repeat();
  }
  render() {
    return (
      null
    );
  }
}
Connect.propTypes = {
  disconnect: PropTypes.func.isRequired,
  thr0wConnect: PropTypes.func.isRequired,
  removeChannel: PropTypes.func.isRequired,
};
export default connect(
  null,
  {
    disconnect: fromConnected.disconnect,
    removeChannel: fromChannel.removeChannel,
    thr0wConnect: fromConnected.connect,
  }
)(Connect);
