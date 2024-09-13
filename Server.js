require('dotenv').config()
const express = require('express');
const app = express();

const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT|| 3500;
const MONGODB_URL = process.env.MONGO_URL;

mongoose.connect(MONGODB_URL)
  .then(() => {
     console.log('Database is connected');
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err.message);
  });
  
app.use(cors())
app.use(express.json())

app.use('/Auth',require('./Router/Router'))
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});