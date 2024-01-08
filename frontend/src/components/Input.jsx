import React from 'react';
import PropTypes from 'prop-types';
import Label from './Label';

function Input({
  label,
  error = false,
  errorMessage = '',
  type,
  placeholder,
  value = '',
  onChange,
}) {
  return (
    <Label
      label={ label }
      error={ error }
      errorMessage={ errorMessage }
    >
      <input
        type={ type }
        placeholder={ placeholder }
        value={ value }
        onChange={ onChange }
      />
    </Label>
  );
}

Input.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default Input;
