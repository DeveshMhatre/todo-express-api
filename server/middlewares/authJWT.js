import jwt from 'jsonwebtoken';
import debugLib from 'debug';
import 'dotenv/config';

import User from '../models/user';

const debug = debugLib('todo:server');

const verifyToken = async (req, res, next) => {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    try {
      const decoded = await jwt.verify(
        req.headers.authorization.split(' ')[1],
        process.env.JWT_SECRET
      );
      const user = await User.findById(decoded?.id);
      req.user = user;
      next();
    } catch (err) {
      req.user = undefined;
      next();
    }
  } else {
    req.user = undefined;
    next();
  }
};

export default verifyToken;
