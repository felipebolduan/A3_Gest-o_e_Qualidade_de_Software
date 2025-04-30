const express = require('express');
const auth = require('../middleware/auth');
const admin = require('firebase-admin');

const router = express.Router();
const db = admin.firestore();
const tasksCollection = db.collection('tasks');

router.get('/', auth, async (req, res) => {
  const tasks = [];
  const snapshot = await tasksCollection.where('userId', '==', req.userId).get();
  snapshot.forEach((doc) => tasks.push({ id: doc.id, ...doc.data() }));
  res.json(tasks);
});

router.get('/:id', auth, async (req, res) => {
  const doc = await tasksCollection.doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ message: 'Tarefa não encontrada.' });
  res.json({ id: doc.id, ...doc.data() });
});

router.post('/', auth, async (req, res) => {
  const { title, description, date, hour } = req.body;

  if (!title || !description || !date || !hour) {
      return res.status(400).json({
          message: 'Os campos title, description, date e hour são obrigatórios.',
      });
  }

  const isValidDate = !isNaN(new Date(date).getTime());
  if (!isValidDate) {
      return res.status(400).json({
          message: 'O campo date precisa ser uma data válida no formato YYYY-MM-DD.',
      });
  }

  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(hour)) {
      return res.status(400).json({
          message: 'O campo hour precisa estar no formato HH:mm (exemplo: 14:30).',
      });
  }

  try {
      const newTask = {
          title,
          description,
          date,
          hour,
          userId: req.userId, 
          completed: false,
          createdAt: new Date().toISOString(),
      };

      const doc = await tasksCollection.add(newTask);

      res.status(201).json({ id: doc.id, ...newTask });
  } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      res.status(500).json({ message: 'Erro ao criar tarefa.' });
  }
});

router.put('/:id', auth, async (req, res) => {
  const { title, description, date, hour, completed } = req.body;

  if (!title && !description && !date && !hour && completed === undefined) {
      return res.status(400).json({
          message: 'Pelo menos um campo (title, description, date, hour ou completed) deve ser enviado para atualização.',
      });
  }

  if (date && isNaN(new Date(date).getTime())) {
      return res.status(400).json({
          message: 'O campo date precisa ser uma data válida no formato YYYY-MM-DD.',
      });
  }

  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (hour && !timeRegex.test(hour)) {
      return res.status(400).json({
          message: 'O campo hour precisa estar no formato HH:mm (exemplo: 14:30).',
      });
  }

  try {
      const updatedFields = {};
      if (title) updatedFields.title = title;
      if (description) updatedFields.description = description;
      if (date) updatedFields.date = date;
      if (hour) updatedFields.hour = hour;
      if (completed !== undefined) updatedFields.completed = completed;

      await tasksCollection.doc(req.params.id).update(updatedFields);
      res.json({ message: 'Tarefa atualizada com sucesso.', updatedFields });
  } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      res.status(500).json({ message: 'Erro ao atualizar tarefa.' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  await tasksCollection.doc(req.params.id).delete();
  res.json({ message: 'Tarefa removida.' });
});

// module.exports = router;
