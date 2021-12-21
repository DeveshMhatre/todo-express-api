import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name not provided.'],
  },
  email: {
    type: String,
    unique: [true, 'Email already exists!'],
    lowercase: true,
    trim: true,
    required: [true, 'Email not provided.'],
    validate: {
      validator: (v) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: '{VALUE} is not a valid email!',
    },
  },
  role: {
    type: String,
    enum: ['normal', 'admin'],
    required: [true, 'Please specify a role.'],
  },
  password: {
    type: String,
    required: [true, 'Password not provided.'],
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('User', userSchema);
