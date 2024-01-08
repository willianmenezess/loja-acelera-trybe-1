import React from 'react';
import PropTypes from 'prop-types';
import 'react-toastify/dist/ReactToastify.css';
import Input from './Input';
import {
  isValidCPF,
  cpfMask,
  isValidCNPJ,
  cnpjMask,
} from '../helpers/validators';
import {
  INVALID_DOCUMENT,

} from '../contants';
import {
  CPF_LENTH, MAX_CPF_LENTH,
} from '../helpers/identifierRules';

function DocumentInput({
  identifier,
  setIdentifier,
}) {
  const handleValidIdentifier = (document) => {
    if (document.length > MAX_CPF_LENTH) {
      return isValidCNPJ(document);
    }
    return isValidCPF(document);
  };

  const handleSetIdentifier = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length >= CPF_LENTH) {
      setIdentifier(cnpjMask(val));
      return;
    }
    setIdentifier(cpfMask(val));
  };

  return (
    <Input
      label="CPF/CNPJ"
      type="text"
      placeholder="123.456.789-01"
      error={ !!identifier && !handleValidIdentifier(identifier) }
      errorMessage={ INVALID_DOCUMENT }
      value={ identifier }
      onChange={ handleSetIdentifier }
    />
  );
}

DocumentInput.propTypes = {
  setIdentifier: PropTypes.func.isRequired,
  identifier: PropTypes.string.isRequired,
};

export default DocumentInput;
