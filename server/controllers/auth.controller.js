import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import User from '../models/user';

const signup = async (req, res) => {
  const user = new User({
    fullName: req?.body?.fullName,
    email: req?.body?.email,
    role: req?.body?.role,
    password: bcrypt.hashSync(req?.body?.password, 8),
  });

  try {
    await user.save();
    res.status(200).send({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(500).send({ message: err?.message });
  }
};

const signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req?.body?.email });

    if (!user) {
      res.status(404).send({ message: 'User not found' });
    } else {
      const verifyPassword = bcrypt.compareSync(
        req?.body?.password,
        user?.password
      );

      if (!verifyPassword) {
        res.status(401).send({
          accessToken: null,
          message: 'Invalid password',
        });
      } else {
        const token = jwt.sign(
          {
            id: user?.id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: 86400,
          }
        );

        res.status(200).send({
          user: {
            id: user?.id,
            email: user?.email,
            fullName: user?.fullName,
            todos: user?.todos,
          },
          message: 'Login successful',
          accessToken: token,
        });
      }
    }
  } catch (err) {
    res.status(500).send({ message: err?.message });
  }
};

export { signup, signin };
