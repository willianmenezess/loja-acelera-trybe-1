/* eslint-disable react/jsx-max-depth */
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import MyProvider from './context/MyProvider';
import Menu from './pages/Menu';
import BankStatement from './pages/BankStatement';
import CreateAccount from './pages/CreateAccount';
import EditAccount from './pages/EditAccount';
import Login from './pages/Login';
import Banner from './components/Banner';

function App() {
  return (
    <MyProvider>
      <ToastContainer />

      <section className="app__container">
        <Banner />
        <main>
          <Routes>
            <Route path="/" element={ <CreateAccount /> } />
            <Route path="/login" element={ <Login /> } />
            <Route path="account" element={ <Menu /> }>
              <Route index element={ <BankStatement /> } />
              <Route path="edit" element={ <EditAccount /> } />
            </Route>
          </Routes>
        </main>
      </section>
    </MyProvider>
  );
}

export default App;
