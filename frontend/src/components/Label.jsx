import React from 'react';
import PropTypes from 'prop-types';
import './Label.css';

function Label({
  label,
  error = false,
  errorMessage = '',
  children,
}) {
  return (
    <label className="label">
      <p>{label}</p>
      {children}
      {error && <span>{errorMessage}</span>}
    </label>
  );
}

Label.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Label;
