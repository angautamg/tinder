const express = require('express');
const { adminAuth } = require('./middleware/adminauth');
const connectDB = require('./config/database');
const app = express()
const port = 3000

// app.use('/hello',adminAuth, (req, res) => {
//   res.send('This is hello in Javascript')
// })
// app.use('/test', (req, res) => {
//   res.send('This is test in Javascript')
// })
// app.use('/', (req, res) => {
//   res.send('Welcome to Javascript');
//   next();
// },(req,res)=>{
//   console.log('Middleware executed for root path');
// })

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
connectDB.then(() => {
  console.log('Database connected successfully'); 
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
}).catch(err => {
  console.error('Database connection failed:', err); 
  process.exit(1);
});
