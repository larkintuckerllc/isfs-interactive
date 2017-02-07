import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import * as fromAuthenticated from '../../../ducks/authenticated';
import ValidatedTextInput from '../../ValidatedTextInput';
import ValidatedPasswordInput from '../../ValidatedPasswordInput';
import styles from './index.scss';

const LOGIN_FORM = 'LOGIN_FORM';
const Authentication = ({
  handleSubmit,
  submitFailed,
  submitting,
  valid,
}) => (
  <div id={styles.root}>
    <form onSubmit={handleSubmit}>
      <Field
        component={ValidatedTextInput} name="username"
        disabled={submitting} props={{ placeholder: 'username' }}
      />
      <Field
        component={ValidatedPasswordInput} name="password"
        disabled={submitting} props={{ placeholder: 'password' }}
      />
      {submitFailed && !submitting && (
        <div className="alert alert-danger" role="alert">Login failed.</div>
      )}
      <div className="form-group">
        <button
          disabled={!valid || submitting}
          type="submit" className="btn btn-default"
        >Login</button>
      </div>
    </form>
  </div>
);
Authentication.propTypes = {
  error: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
};
const AuthenticationForm = reduxForm({
  form: LOGIN_FORM,
  validate: values => {
    const errors = {};
    if (values.username === undefined) errors.username = '400';
    if (values.password === undefined) errors.password = '400';
    return errors;
  },
})(Authentication);
class AuthenticationSubmit extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit({ username, password }) {
    const { login } = this.props;
    return login(username, password)
      .then(
        () => {},
        error => {
          if (error.name !== 'Thr0wException') {
            window.console.log(error);
            return;
          }
          if (error.message === '401') {
            throw new SubmissionError({
              username: '400',
              password: '400',
            });
          }
          throw new SubmissionError({});
        }
      );
  }
  render() {
    return <AuthenticationForm onSubmit={this.handleSubmit} />;
  }
}
AuthenticationSubmit.propTypes = {
  login: PropTypes.func.isRequired,
};
export default connect(
  null,
  {
    login: fromAuthenticated.login,
  }
)(AuthenticationSubmit);
