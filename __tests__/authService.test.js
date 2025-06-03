const authService = require('../services/authService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getFirestore } = require('firebase-admin/firestore');

jest.mock('../config/firebase', () => ({
  db: {
    collection: jest.fn(() => ({
      where: jest.fn(() => ({
        get: jest.fn(async () => ({
          empty: false,
          docs: [{ id: '123', data: () => ({ email: 'teste@teste.com', password: '1234' }) }],
        })),
      })),
    })),
  },
}));

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('firebase-admin/firestore', () => ({
  getFirestore: jest.fn(),
}));

describe('authService', () => {
  const mockCollection = jest.fn();
  const mockWhere = jest.fn();
  const mockGet = jest.fn();

  beforeEach(() => {
    mockGet.mockReset();
    getFirestore.mockReturnValue({
      collection: mockCollection.mockReturnValue({
        where: mockWhere.mockReturnValue({
          get: mockGet,
        }),
      }),
    });
  });

  test('O login deve retornar o token quanto as credenciais forem válidas', async () => {
    const mockUser = { id: '123', email: 'teste@teste.com', password: 'protegido' };
    mockGet.mockResolvedValueOnce({
      empty: false,
      docs: [{ id: '123', data: () => mockUser }],
    });
    bcrypt.compare.mockResolvedValueOnce(true);
    jwt.sign.mockReturnValue('mocked_token');

    const token = await authService.login('teste@teste.com', 'senha');
    expect(token).toBe('mocked_token');
  });

  test('O login deve retornar o erro 404 se o usuário não for encontrado', async () => {
    mockGet.mockResolvedValueOnce({ empty: true });

    await expect(authService.login('naoencontrado@teste.com', 'senha'))
      .rejects.toMatchObject({ code: 404 });
  });

  test('O login deve retornar o erro 401 se a senha for inválida', async () => {
    const mockUser = { id: '123', email: 'teste@teste.com', password: 'protegido' };
    mockGet.mockResolvedValueOnce({
      empty: false,
      docs: [{ id: '123', data: () => mockUser }],
    });
    bcrypt.compare.mockResolvedValueOnce(false);

    await expect(authService.login('teste@teste.com', 'senha errada'))
      .rejects.toMatchObject({ code: 401 });
  });
});