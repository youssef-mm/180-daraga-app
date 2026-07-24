const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { sequelize } = require('./models');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const meetingRoutes = require('./routes/meetingRoutes');
app.use('/api/meetings', meetingRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database connected and models synced successfully.');
    app.listen(PORT, '0.0.0.0', () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((err) => console.error('Failed to sync database:', err));