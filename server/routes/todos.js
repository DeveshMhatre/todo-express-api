import express from 'express';

import { create, destroy, list, show } from '../controllers/todo.controller';

const router = express.Router();

router.post('/create', create);
router.get('/list', list);
router.get('/show/:task', show);
router.delete('/delete/:task', destroy);

export default router;
