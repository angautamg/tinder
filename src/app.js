const express = require('express');
const { adminAuth } = require('./middleware/adminauth');
const connectDB = require('./config/database');
const app = express()
const port = 3000;
app.use(express.json());

app.post('/api/auth/register', async (req, res) => {
  try {
    const User = require('./models/user');
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }

});


connectDB().then(() => {
  console.log('Database connected successfully'); 
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
}).catch(err => {
  console.error('Database connection failed:', err); 
  process.exit(1);
});
