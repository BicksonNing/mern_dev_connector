const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const userRoutes = require('./routes/api/userRoutes');
const authRoutes = require('./routes/api/authRoutes');
const profileRoutes = require('./routes/api/profileRoutes');
const postsRoutes = require('./routes/api/postRoutes');

const app = express();

//connect DB
connectDB();

//Init Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Orgin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'PUT, GET, POST, PATCH, DELETE'
  );
  next();
});

// Define Routes

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/posts', postsRoutes);

// serve static assets in production

if (process.env.NODE_ENV === 'production') {
  // set static folder
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
