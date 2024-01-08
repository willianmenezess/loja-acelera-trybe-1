import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import App from '../App';
import { INVALID_CPF_NUMBERS, INVALID_DOCUMENT, INVALID_PASSWORD, INVALID_PASSWORD_NUMBER, VALID_CNPJ, VALID_CNPJ_NUMBERS, VALID_CPF, VALID_CPF_NUMBERS, VALID_PASSWORD } from '../contants';
import { renderWithRouter } from './helpers/renderWithRouter';

describe('Login page', () => {
  test('should login successfully if a valid CPF is inserted', async () => {
    vi.spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          token: '1234',
        }),
      }).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue([]),
      });
    const { user } = renderWithRouter(<App />, { route: '/login' });

    screen.getByRole('heading', { level: 1, name: /login/i });

    const identifier = screen.getByLabelText(/CPF/);
    const password = screen.getByLabelText(/senha/i);

    await user.type(identifier, VALID_CPF_NUMBERS);
    await user.type(password, VALID_PASSWORD);

    expect(identifier.value).toBe(VALID_CPF);
    expect(password.value).toBe(VALID_PASSWORD);

    const submitBtn = screen.getByRole('button', { name: /Entrar/i });

    await user.click(submitBtn);

    await screen.findByRole('heading', { level: 1, name: /Extrato/i });
  });

  test('should login successfully if a valid CNPJ is inserted', async () => {
    vi.spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          token: '1234',
        }),
      }).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue([]),
      });
    const { user } = renderWithRouter(<App />, { route: '/login' });

    screen.getByRole('heading', { level: 1, name: /login/i });

    const identifier = screen.getByLabelText(/CPF/);
    const password = screen.getByLabelText(/senha/i);

    await user.type(identifier, VALID_CNPJ_NUMBERS);
    await user.type(password, VALID_PASSWORD);

    expect(identifier.value).toBe(VALID_CNPJ);
    expect(password.value).toBe(VALID_PASSWORD);

    const submitBtn = screen.getByRole('button', { name: /Entrar/i });

    await user.click(submitBtn);

    await screen.findByRole('heading', { level: 1, name: /Extrato/i });
  });

  test(`should show ${INVALID_DOCUMENT} if the identifier is incorrect`, async () => {
    const { user } = renderWithRouter(<App />, { route: '/login' });

    const identifier = screen.getByLabelText(/CPF/);

    await user.type(identifier, INVALID_CPF_NUMBERS);

    const errorMessage = screen.getByText(INVALID_DOCUMENT);
    expect(errorMessage).toBeInTheDocument();
  });

  test(`should show ${INVALID_PASSWORD} if the password is incorrect`, async () => {
    const { user } = renderWithRouter(<App />, { route: '/login' });

    const password = screen.getByLabelText(/senha/i);

    await user.type(password, INVALID_PASSWORD_NUMBER);

    const errorMessage = screen.getByText(INVALID_PASSWORD);
    expect(errorMessage).toBeInTheDocument();
  });
});
