import express from 'express';

import {
  create,
  destroy,
  list,
  show,
  update,
} from '../controllers/todo.controller';

const router = express.Router();

router.post('/create', create);
router.get('/list', list);
router.get('/show/:task', show);
router.patch('/update/:task', update);
router.delete('/delete/:task', destroy);

export default router;
