const express = require('express');
const app = express()
const port = 3000

app.use('/hello', (req, res) => {
  res.send('This is hello in Javascript')
})
app.use('/test', (req, res) => {
  res.send('This is test in Javascript')
})
app.use('/', (req, res) => {
  res.send('Welcome to Javascript')
})

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
