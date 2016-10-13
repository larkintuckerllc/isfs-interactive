import React, { PropTypes } from 'react';

const ValidatedTextInput = ({ input, placeholder, disabled, meta: { touched, valid } }) => (
  <div className={`form-group ${!valid && touched && 'has-error'}`}>
    <input
      {...input}
      placeholder={placeholder}
      type="text"
      disabled={disabled}
      className="form-control"
    />
  </div>
);
ValidatedTextInput.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  placeholder: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
};
export default ValidatedTextInput;
