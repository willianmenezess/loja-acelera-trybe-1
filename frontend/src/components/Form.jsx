import React from 'react';
import PropTypes from 'prop-types';
import './Form.css';

function Form({ children, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={ handleSubmit } className="form-container">
      {children}
    </form>
  );
}

Form.propTypes = {
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default Form;
