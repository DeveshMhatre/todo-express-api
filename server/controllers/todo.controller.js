import debugLib from 'debug';

import Todo from '../models/todo';
import User from '../models/user';

const debug = debugLib('todo:server');

const create = async (req, res) => {
  if (!req.user) {
    res.status(403).send({ message: 'User not logged in' });
    return;
  }

  const { title, completed } = req.body;
  const { id } = req.user;

  const task = new Todo({
    title,
    completed,
    user: id,
  });

  try {
    await task.save();
    await User.findByIdAndUpdate(id, {
      $push: { todos: task.id },
    });
    res.status(200).send({ message: 'Task successfully created' });
  } catch (err) {
    res.status(500).send({ message: err?.message });
  }
};

const list = async (req, res) => {
  if (!req.user) {
    res.status(403).send({ message: 'User not logged in' });
    return;
  }

  const { id } = req.user;

  try {
    const tasks = await Todo.find({ user: id });
    res.status(200).send({
      message: 'Tasks fetched successfully',
      tasks: tasks.map((task) => {
        return {
          id: task.id,
          title: task.title,
          completed: task.completed,
        };
      }),
    });
  } catch (err) {
    res.status(500).send({ message: err?.message });
  }
};

const show = async (req, res) => {
  if (!req.user) {
    res.status(403).send({ message: 'User not logged in' });
    return;
  }

  const { todos } = req.user;
  const { task } = req.params;

  if (!todos.includes(task)) {
    res.status(403).send({ message: 'Unauthorised access' });
    return;
  }

  try {
    const todo = await Todo.findById(task);
    res.status(200).send({
      message: 'Task fetched successfully',
      todo: {
        id: todo.id,
        title: todo.title,
        completed: todo.completed,
      },
    });
  } catch (err) {
    res.status(500).send({ message: err?.message });
  }
};

const destroy = async (req, res) => {
  if (!req.user) {
    res.status(403).send({ message: 'User not logged in' });
    return;
  }

  const { id, todos } = req.user;
  const { task } = req.params;

  if (!todos.includes(task)) {
    res.status(403).send({ message: 'Unauthorised access' });
    return;
  }

  try {
    await Todo.findByIdAndDelete(task);
    await User.findByIdAndUpdate(id, { $pull: { todos: task } });
    res.status(200).send({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).send({ message: err?.message });
  }
};

export { create, list, show, destroy };
