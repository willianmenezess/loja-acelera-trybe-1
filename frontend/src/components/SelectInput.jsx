import React from 'react';
import PropTypes from 'prop-types';
import Label from './Label';

function SelectInput({
  label,
  error = false,
  errorMessage = '',
  options,
  value = '',
  onChange,
}) {
  return (
    <Label label={ label } error={ error } errorMessage={ errorMessage }>
      <select value={ value } onChange={ onChange }>
        {options.map((option) => (
          <option value={ option.value } key={ option.value }>
            {option.label}
          </option>
        ))}
      </select>
    </Label>
  );
}

SelectInput.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number,
    ]),
    label: PropTypes.string.isRequired,
  })).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]),
  onChange: PropTypes.func.isRequired,
};

export default SelectInput;
