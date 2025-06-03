const { getFirestore } = require('firebase-admin/firestore');

  function getDb() {
    return getFirestore()
  }

  function getTasksCollection() {
    return getDb().collection('tasks')
  }

function validateTask({ title, description, date, hour }) {
  if (!title || !description || !date || !hour) {
    return 'Os campos title, description, date e hour são obrigatórios.';
  }

  if (isNaN(new Date(date).getTime())) {
    return 'O campo date precisa ser uma data válida no formato YYYY-MM-DD.';
  }

  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(hour)) {
    return 'O campo hour precisa estar no formato HH:mm (exemplo: 14:30).';
  }

  return null;
}

function validateUpdate({ date, hour }) {
  if (!date && !hour) return null;

  if (date && isNaN(new Date(date).getTime())) {
    return 'O campo date precisa ser uma data válida no formato YYYY-MM-DD.';
  }

  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (hour && !timeRegex.test(hour)) {
    return 'O campo hour precisa estar no formato HH:mm (exemplo: 14:30).';
  }

  return null;
}

async function getAllTasks(userId) {
  const snapshot = await getTasksCollection().where('userId', '==', userId).get();
  const tasks = [];
  snapshot.forEach((doc) => tasks.push({ id: doc.id, ...doc.data() }));
  return tasks;
}

async function getTaskById(id) {
  const doc = await getTasksCollection().doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function createTask(userId, { title, description, date, hour }) {
  const newTask = {
    title,
    description,
    date,
    hour,
    userId,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  const doc = await tasksCollection.add(newTask);
  return { id: doc.id, ...newTask };
}

async function updateTask(id, fields) {
  const updatedFields = {};
  if (fields.title) updatedFields.title = fields.title;
  if (fields.description) updatedFields.description = fields.description;
  if (fields.date) updatedFields.date = fields.date;
  if (fields.hour) updatedFields.hour = fields.hour;
  if (fields.completed !== undefined) updatedFields.completed = fields.completed;

  await getTasksCollection().doc(id).update(updatedFields);
  return updatedFields;
}

async function deleteTask(id) {
  await getTasksCollection().doc(id).delete();
}

module.exports = {
  validateTask,
  validateUpdate,
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
