import express from 'express';
import debugLib from 'debug';

const router = express.Router();
const debug = debugLib('todo:server');

/* GET home page. */
router.get('/', (req, res) => {
  if (!req.user) {
    res.status(403).send({
      message: 'Invalid JWT token',
    });
  }
  if (req?.user?.role === 'admin') {
    res.status(200).send({
      message: 'Congratulations! But there is no hidden content',
    });
  } else {
    res.status(403).send({
      message: 'Unauthorised access',
    });
  }
});

export default router;
