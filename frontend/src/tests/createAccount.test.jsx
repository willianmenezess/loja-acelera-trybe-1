import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import App from '../App';
import { VALID_CPF, VALID_EMAIL, VALID_NAME, VALID_PASSWORD } from '../contants';
import { renderWithRouter } from './helpers/renderWithRouter';

describe('Create Account page', () => {
  test('should create an account successfully', async () => {
    vi.spyOn(global, 'fetch')
      .mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          token: '1234',
        }),
      });
    const { user } = renderWithRouter(<App />);

    screen.getByRole('heading', { level: 1, name: /Crie sua conta/i });

    const name = screen.getByLabelText(/Nome/);
    const email = screen.getByLabelText(/Email/i);
    const identifier = screen.getByLabelText(/CPF/);
    const password = screen.getByLabelText('Senha');
    const passwordConfirmation = screen.getByLabelText('Confirma Senha');

    await user.type(name, VALID_NAME);
    await user.type(email, VALID_EMAIL);
    await user.type(identifier, VALID_CPF);
    await user.type(password, VALID_PASSWORD);
    await user.type(passwordConfirmation, VALID_PASSWORD);

    const btnConfirm = screen.getByRole('button', { name: /Crie sua conta/i });

    await user.click(btnConfirm);

    screen.getByRole('heading', { level: 1, name: /login/i });
  });
});
