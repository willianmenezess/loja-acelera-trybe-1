import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { getTokenLocalStorage, setTokenLocalStorage } from '../helpers/localStorage';
import { Context } from './MyContext';

// const accountFake = {
//   name: 'jensen',
//   identifier: '12312312323',
//   email: 'jensen@jensen.com',
//   password: '123456',
//   status: true,
//   id: 2,
// };

function MyProvider({ children }) {
  const [account, setAccount] = useState({});
  const [token, setToken] = useState(getTokenLocalStorage());

  useEffect(() => {
    setTokenLocalStorage(token);
  }, [token]);

  const value = useMemo(() => ({
    account,
    setAccount,
    token,
    setToken,
  }), [account, token]);

  return (
    <Context.Provider value={ value }>
      {children}
    </Context.Provider>
  );
}

MyProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MyProvider;
