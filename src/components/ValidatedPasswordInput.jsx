import React, { PropTypes } from 'react';

const ValidatedPasswordInput = ({ input, placeholder, disabled, meta: { touched, valid } }) => (
  <div
    className={[
      'form-group',
      !valid && touched ? 'has-error' : null,
    ].join(' ')}
  >
    <input
      {...input} placeholder={placeholder}
      type="password" disabled={disabled} className="form-control"
    />
  </div>
);
ValidatedPasswordInput.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  placeholder: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
};
export default ValidatedPasswordInput;
