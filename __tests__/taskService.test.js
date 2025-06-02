const { validateTask, validateUpdate } = require('../services/taskService');

describe('taskService - validateTask', () => {
  test('Deve retornar erro se algum campo estiver faltando', () => {
    const result = validateTask({ title: '', description: '', date: '', hour: '' });
    expect(result).toBe('Os campos title, description, date e hour são obrigatórios.');
  });

  test('Deve retornar erro caso a data seja inválida', () => {
    const result = validateTask({ title: 'A', description: 'B', date: 'invalido', hour: '12:00' });
    expect(result).toBe('O campo date precisa ser uma data válida no formato YYYY-MM-DD.');
  });

  test('Deve retornar erro se o formato de hora for inválido', () => {
    const result = validateTask({ title: 'A', description: 'B', date: '2024-01-01', hour: '99:99' });
    expect(result).toBe('O campo hour precisa estar no formato HH:mm (exemplo: 14:30).');
  });

  test('Deve retornar nulo se todos os campos forem válidos', () => {
    const result = validateTask({ title: 'A', description: 'B', date: '2024-01-01', hour: '14:30' });
    expect(result).toBeNull();
  });
});

describe('taskService - validateUpdate', () => {
  test('Deve retornar nulo se nenhum campo for fornecido', () => {
    const result = validateUpdate({});
    expect(result).toBeNull();
  });

  test('Deve retornar erro caso a data seja inválida', () => {
    const result = validateUpdate({ date: 'not-a-date' });
    expect(result).toBe('O campo date precisa ser uma data válida no formato YYYY-MM-DD.');
  });

  test('Deve retornar erro se a hora for inválida', () => {
    const result = validateUpdate({ hour: '25:00' });
    expect(result).toBe('O campo hour precisa estar no formato HH:mm (exemplo: 14:30).');
  });

  test('Deve retornar nulo se os campos de atualização forem válidos', () => {
    const result = validateUpdate({ date: '2024-01-01', hour: '10:00' });
    expect(result).toBeNull();
  });
});