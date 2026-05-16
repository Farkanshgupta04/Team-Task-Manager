const express  = require('express');
const cors     = require('cors');
const helmet   = require('helmet');
const morgan   = require('morgan');

const authRoutes    = require('./routes/auth');
const userRoutes    = require('./routes/users');
const projectRoutes = require('./routes/projects');
const taskRoutes    = require('./routes/tasks');

const app = express();

const isAllowedDevOrigin = (origin) => {
  if (!origin) return true;
  if (process.env.NODE_ENV === 'production') return origin === process.env.CLIENT_URL;
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
};

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (isAllowedDevOrigin(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth',     authRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks',    taskRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

module.exports = app;
