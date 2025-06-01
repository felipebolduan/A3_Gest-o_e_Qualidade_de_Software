const TaskService = require('../services/taskService');

module.exports = {
  async getAllTasks(req, res) {
    try {
      const tasks = await TaskService.getAllTasks(req.userId);
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ message: 'Erro ao buscar tarefas.' });
    }
  },

  async getTaskById(req, res) {
    try {
      const task = await TaskService.getTaskById(req.params.id);
      if (!task) return res.status(404).json({ message: 'Tarefa não encontrada.' });
      res.json(task);
    } catch (err) {
      res.status(500).json({ message: 'Erro ao buscar tarefa.' });
    }
  },

  async createTask(req, res) {
    const { title, description, date, hour } = req.body;

    const validationError = TaskService.validateTask({ title, description, date, hour });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    try {
      const task = await TaskService.createTask(req.userId, { title, description, date, hour });
      res.status(201).json(task);
    } catch (err) {
      res.status(500).json({ message: 'Erro ao criar tarefa.' });
    }
  },

  async updateTask(req, res) {
    const { title, description, date, hour, completed } = req.body;

    const validationError = TaskService.validateUpdate({ date, hour });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    try {
      const updatedFields = await TaskService.updateTask(req.params.id, { title, description, date, hour, completed });
      res.json({ message: 'Tarefa atualizada com sucesso.', updatedFields });
    } catch (err) {
      res.status(500).json({ message: 'Erro ao atualizar tarefa.' });
    }
  },

  async deleteTask(req, res) {
    try {
      await TaskService.deleteTask(req.params.id);
      res.json({ message: 'Tarefa removida.' });
    } catch (err) {
      res.status(500).json({ message: 'Erro ao remover tarefa.' });
    }
  }
};
