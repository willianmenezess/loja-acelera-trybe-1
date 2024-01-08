const express = require('express');
const cors = require('cors');

const { accountRouter, loginRouter, transactionRouter } = require('./routes');

const app = express();

app.use(express.json());
app.use(cors());

app.get('/health', (_req, res) => res.status(200).json({ message: 'I\'m alive' }));
app.use('/accounts', accountRouter);
app.use('/login', loginRouter);
app.use('/transactions', transactionRouter);

app.all('*', (_req, res) => res.status(501).json({ message: 'Not implemented' }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'internal error' }); 
});

module.exports = app;