var express = require('express')
var app = express()
var passport = require('passport')
var session = require('express-session')
var bodyParser = require('body-parser')
var fs = require('fs')
var xml2js = require('xml2js')
var env = require('dotenv').load()
var exphbs = require('express-handlebars')
var parser = new xml2js.Parser()
var cors = require('cors')
const path = require('path')
const xmlParser = require('xml2js').parseString
const moment = require('moment')
var filewatcher = require('filewatcher')
var watcher = filewatcher()
watcher.add('./xmltv.xml')

//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})
//Models
var models = require('./app/models')
app.use((req, res, next) => {
  req.db = models
  next()
})
//Routes
var authRoute = require('./app/routes/auth.js')(app, passport)

watcher.on('change', function(file, stat) {
  console.log('File modified: %s', file)
  addChangeToDB(file)
})
function addChangeToDB(file) {
    const xml = fs.readFile(
        file,
        'utf8',
        (err, result) => {
          xmlParser(result, (err, data) => {
            if (err) {
                console.log(err)
            } else {
              const programm = data.tv.programme
              const programme = programm.map(el => {
                return {
                  channelId: el.$.channel,
                  start: el.$.start,
                  stop: el.$.stop,
                  title: el.title[0]._,
                  category: el.category ? el.category[0]._ : null
                }
              })
              models.epgs.bulkCreate(programme.slice(0,1000),
              {
                ignoreDuplicates: true
              })
              console.log('Готово!')
            }
          })
        }
      )
}
function formatterDate(date) {
    return new Date(+date.split(' ')[0])
  } 
//Sync Database
models.sequelize
  .sync()
  .then(function() {
    console.log('Nice! Database looks fine')
  })
  .catch(function(err) {
    console.log(err, 'Something went wrong with the Database Update!')
  })

app.listen(5001, function(err) {
  if (!err) console.log('Site is live')
  else console.log(err)
})
