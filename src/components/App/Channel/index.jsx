import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import * as fromAuthenticated from '../../../ducks/authenticated';
import * as fromChannel from '../../../ducks/channel';
import ValidatedTextInput from '../../ValidatedTextInput';
import styles from './index.scss';

const CHANNEL_FORM = 'CHANNEL_FORM';
const Channel = ({
  handleSubmit,
  logout,
  submitting,
  valid,
}) => (
  <div id={styles.root}>
    <form onSubmit={handleSubmit}>
      <Field
        component={ValidatedTextInput} name="channel"
        disabled={submitting} props={{ placeholder: 'channel' }}
      />
      <div className="form-group">
        <button
          disabled={!valid || submitting}
          type="submit" className="btn btn-default"
        >Connect</button>
      </div>
      <div className="form-group">
        <button
          disabled={submitting}
          type="button"
          className="btn btn-default"
          onClick={logout}
        >Logout</button>
      </div>
    </form>
  </div>
);
Channel.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
};
const ChannelForm = reduxForm({
  form: CHANNEL_FORM,
  validate: ({ channel }) => {
    const errors = {};
    if (
      channel === undefined ||
      parseInt(channel, 10).toString() !== channel
    ) errors.channel = '400';
    return errors;
  },
})(Channel);
class ChannelSubmit extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit({ channel }) {
    const { setChannel } = this.props;
    setChannel(parseInt(channel, 10));
    return Promise.resolve();
  }
  render() {
    const { logout } = this.props;
    return (
      <ChannelForm
        logout={logout}
        onSubmit={this.handleSubmit}
      />
    );
  }
}
ChannelSubmit.propTypes = {
  logout: PropTypes.func.isRequired,
  setChannel: PropTypes.func.isRequired,
};
export default connect(
  null,
  {
    logout: fromAuthenticated.logout,
    setChannel: fromChannel.setChannel,
  }
)(ChannelSubmit);
