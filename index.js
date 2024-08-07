const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const models = require('./models/index')
const { processRequest } = require('./controllers/baseController')
const env = require('./.env.json')
const multer = require('multer')

const app = express();

app.use(bodyParser.json())
mongoose.connect(env.testDB.url)

app.get('/',  (req, res) => {
 res.send('Hello World!')
})

app.get('/api/shick', (req, res) => {
  let shaffaf = new models.testModel({
    name: 'Shaffaaf',
    size: 'small'
  })
  shaffaf.save((err) => {
    if(err){
      console.log(err)
    } else {
      console.log('meow')
    }
  })
})

//api routes
app.get('/api/:type*', async (req, res) => {
  processRequest(req , res)
})

app.post('/api/:type*',  async (req, res) => {
  processRequest(req, res)
})

app.put('/api/:type*',  async (req, res) =>{
  processRequest(req, res)
})

app.delete('/api/:type*', async (req, res) =>{
  processRequest(req, res)
})


var uploader = multer({
  dest: 'uploads/',
  limits: {fileSize: 1100000, files: 12 }
})

app.post('api/upload', uploader.array('files'), async (req, res) => {
  return res.status(200).send(req.files)
})

app.post('api/anonupload', uploader.array('files'),async (req, res) => {
  return res.status(200).send(req.files)
})

app.listen(3000, function () {
 console.log('Example app listening on port 3000!')
});
