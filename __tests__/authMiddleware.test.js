const authMiddleware = require('../middleware/auth');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('authMiddleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  test('deve retornar 403 se não tiver token', () => {
    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token ausente.' });
    expect(next).not.toHaveBeenCalled();
  });

  test('Deve retornar 403 se o token for invalido', () => {
    req.headers.authorization = 'Bearer invalidtoken';
    jwt.verify.mockImplementation(() => { throw new Error(); });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido.' });
    expect(next).not.toHaveBeenCalled();
  });

  test('deve chamar next e anexar userId se o token for válido', () => {
    req.headers.authorization = 'Bearer validtoken';
    jwt.verify.mockReturnValue({ uid: 'user123' });

    authMiddleware(req, res, next);

    expect(req.userId).toBe('user123');
    expect(next).toHaveBeenCalled();
  });
});