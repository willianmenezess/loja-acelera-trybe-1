import React, { useContext, useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { Context } from '../context/MyContext';
import { getAccount } from '../services/api';
import './Menu.css';
import Button from '../components/Button';

function Menu() {
  const { account, setAccount, token, setToken } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(true);
  const toggleDrawer = () => setIsOpen((prevState) => !prevState);

  useEffect(() => {
    async function fetchAccount() {
      try {
        const response = await getAccount(token);
        setLoading(false);
        setAccount(response);
      } catch (error) {
        navigate('/login');
      }
    }
    fetchAccount();
  }, [setAccount, navigate, token]);

  const logOff = () => {
    setToken(null);
    setAccount({});
    navigate('/login');
  };

  if (loading) return <section>Loading</section>;

  return (
    <section className="drawer">
      <Button onClick={ toggleDrawer } type="button">Menu</Button>
      <Drawer
        open={ isOpen }
        onClose={ toggleDrawer }
        direction="left"
        className="menu"
      >
        <div className="profile">
          <p>{account.name}</p>
          <span>{account.identifier}</span>
        </div>
        <div className="links">
          <Link to="/account">Extratos</Link>
          <Link to="/account/edit">Editar Perfil</Link>
        </div>
        <Button onClick={ logOff } type="button">Sair</Button>
      </Drawer>

      <Outlet />
    </section>

  );
}

export default Menu;
