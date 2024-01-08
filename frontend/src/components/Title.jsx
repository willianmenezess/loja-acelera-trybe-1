import React from 'react';
import PropTypes from 'prop-types';
import './Title.css';

function Title({ title }) {
  return (
    <h1>{title}</h1>
  );
}

Title.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Title;
