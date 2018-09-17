var authController = require('../controllers/authcontroller.js')
const fs = require('fs')
const path = require('path')
const xmlParser = require('xml2js').parseString
const moment = require('moment')

module.exports = function (app, passport) {
  
  
  app.post('/listEpg', (req, res) => {
     if (
      !req.body.sessionId ||
      !req.body.channelId ||
      !req.body.fromDate ||
      !req.body.toDate
    ) {
      res.statusCode = 400
      res.end()
    } else {
     
      console.log(path.basename(process.env.filePath + '/xmltv.xml'))
       // Отдаем
      const result = programme.filter(el => {
        if (
          el.channelId == req.body.channelId &&
          moment(formatterDate(el.start)) >=
          moment(formatterDate(req.body.fromDate)) &&
          moment(formatterDate(el.stop)) <=
          moment(formatterDate(req.body.toDate))
        ) {
          return el
        }
      })
      res.statusCode = 200
      res.json(result)
      res.end()
    }
  })
}
