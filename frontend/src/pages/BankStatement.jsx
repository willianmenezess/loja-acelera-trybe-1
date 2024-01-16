import React, { useContext, useEffect, useState } from 'react';
import Title from '../components/Title';
import { Context } from '../context/MyContext';
import { formatDate } from '../helpers/date';
import { getTransactions } from '../services/api';
import './BankStatement.css';

function BankStatement() {
  const { token } = useContext(Context);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await getTransactions(token);
        setTransactions(response);
      } catch (error) {
        console.log(error);
      }
    }
    fetchTransactions();
  }, [token]);

  return (
    <section className="bank__statement">
      <header className="header">
        <Title title="Extrato" />
        <h2>Total de cashback</h2>
        <span>{`R$ ${transactions.reduce((s, t) => s + t.value * t.cashback, 0)}`}</span>
      </header>
      <section className="transactions">
        <ul>
          {transactions.map((transaction) => (
            <li key={ transaction.date } className="transaction">
              <div className="transaction__item">
                <span>Compra</span>
                <span>{formatDate(transaction.date)}</span>
              </div>
              <div className="transaction__value">
                <span>{`R$ ${transaction.value}`}</span>
                <span>{transaction.cashback}</span>
              </div>
            </li>
          ))}

        </ul>
      </section>
    </section>
  );
}

export default BankStatement;
