import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

function Button({ children, onClick = () => {}, type }) {
  return (
    <button type={ type } onClick={ onClick }>
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.string.isRequired,
};

export default Button;
