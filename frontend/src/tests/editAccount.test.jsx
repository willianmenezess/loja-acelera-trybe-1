import { screen } from '@testing-library/react';
import { expect, vi } from 'vitest';
import App from '../App';
import {
  fakeAccount,
  fakeTransactions,
  VALID_CPF_NUMBERS,
  VALID_EMAIL,
  VALID_NAME,
  VALID_PASSWORD,
} from '../contants';
import { renderWithRouter } from './helpers/renderWithRouter';

describe('Edit Account page', () => {
  test('should edit an account successfully', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: vi
        .fn()
        .mockResolvedValueOnce({
          token: '1234',
        })
        .mockRejectedValueOnce(fakeAccount)
        .mockResolvedValue(fakeTransactions),
    });
    const { user } = renderWithRouter(<App />, { route: '/login' });

    // Login
    const identifierLogin = screen.getByLabelText(/CPF/);
    const passwordLogin = screen.getByLabelText(/senha/i);
    await user.type(identifierLogin, VALID_CPF_NUMBERS);
    await user.type(passwordLogin, VALID_PASSWORD);
    const submitBtn = screen.getByRole('button', { name: /Entrar/i });
    await user.click(submitBtn);

    await screen.findByRole('heading', { level: 1, name: /Extrato/i });

    // navigate to edit Account
    const editAccountLink = screen.getByText('Editar Perfil');
    await user.click(editAccountLink);

    const name = screen.getByLabelText(/Nome/);
    const email = screen.getByLabelText(/Email/i);

    expect(name.value).toBe(fakeAccount.name);
    expect(email.value).toBe(fakeAccount.email);

    await user.type(name, VALID_NAME);
    await user.type(email, VALID_EMAIL);

    const btnConfirm = screen.getByRole('button', {
      name: /Editar sua conta/i,
    });
    await user.click(btnConfirm);
  });
});
