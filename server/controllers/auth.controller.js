import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import User from '../models/user';

const signup = async (req, res) => {
  const { fullName, email, role, password } = req.body;

  if (!password) {
    res.status(400).send({ message: 'Password not provided' });
    return;
  }

  const user = new User({
    fullName: fullName,
    email: email,
    role: role,
    password: bcrypt.hashSync(password, 8),
  });

  try {
    await user.save();
    res.status(200).send({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(500).send({ message: err?.message });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(404).send({ message: 'User not found' });
    } else {
      const verifyPassword = bcrypt.compareSync(password, user?.password);

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
