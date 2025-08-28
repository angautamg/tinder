const express = require('express');
const { adminAuth } = require('./middleware/adminauth');
const connectDB = require('./config/database');
const {validateSignupData} = require('./utils/validation');
//const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express()
const port = 3000;
app.use(express.json());
app.use(bodyParser.json());

app.post('/api/auth/register', async (req, res) => {
  try {
    const User = require('./models/user');
    //validateSignupData(req);
    //const user = new User(req.body);
    const [firstName, lastName, email, age,gender,password]= req.body;
    console.log(req.body);
    //const passwordHash = await bcrypt(password,10);

    //const user = new User({firstName, lastName, email, password:passwordHash,age,gender});
    //console.log(user);
    //await user.save();
    res.status(201).send("login successful");
  } catch (error) {
    res.status(400).send(error);
  }

});
app.post('/api/auth/login', async (req, res) => {
  try {
    const User = require('./models/user');
    const { email, password } = req.body;
    //const user = await User.findByCredentials(email, password);
    const user = await User.findOne({ email });
    if (!user) {
     throw new Error('Login failed! Check authentication credentials');
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch) {
       delete user.password;
       delete user.tokens;
       const token = jwt.sign({ _id: user._id.toString() }, 'mysecret', { expiresIn: '1h' });
  
        user.tokens = user.tokens.concat({ token });
      res.send(user);
    }
    //const token = await user.generateAuthToken();
   // res.send({ user, token });
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
