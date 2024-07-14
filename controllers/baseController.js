const  models = require('../models/index')

let type = ''
let id = ''
let query = {}
let model = {}
let modelProps = {}
let queryObject = {}
let textQueryObject = {}
let sortObject = {}
let populateQuery = ['']
let items = []
let failedItems = []
let message = ''
let status = ''
let reqData = {}

var processRequest = async (req, res) => {

  type = req.params.type
  query = req.query


  //getModel
  model = models[type] ? models[type]['model'] : null
  //check model
  if (!model) {
    return res.status(404).send('No model by the name:' + type)
  }

  modelProps = models[type]['modelProps']

  //addDefaultPopulateData
  populateQuery = modelProps.defaultPopulateQuery ? modelProps.defaultPopulateQuery : []




  //set id
  let id = req.params[0] ? req.params[0].substring(1) : null
  if (id) queryObject['_id'] = id

  //addQueries
  if (req.query) {
    console.log(req.query)
    //if there are queries
    if (req.query.query) {
      let queryKeyValues = req.query.query.split(',')
      queryKeyValues.map((item) => {
        item = item.split(':')
        if (item[1].match(/^\*/)) {
          if (item[1].indexOf('*') == 0) {
            item[1] = item[1].slice(1)
          } else {
            item[1] = item[1].slice(0, -1)
          }
          queryObject[item[0]] = { $regex: new RegExp(item[1]) }
        } else {
          queryObject[item[0]] = item[1]
        }
      })
    }
    //if sort is provided
    if (req.query.sort) {
      let sortKeyValues = req.query.sort.split(',')
      sortKeyValues.map((item) => {
        item = item.split(':')
        sortObject[item[0]] = item[1] == 'dsc' ? -1 : 1
      })
    }

  }


  //set request data for POST and PUT
  if (req.body) reqData = req.body

  //finally query from database and show result

  switch (req.method) {

    case 'GET': {
      let result = await retrieve()
      if (result) {
        return res.status(status).send(items)
      } else {
        return res.status(status).send({
          'message': message,
          'queryObject': queryObject
        })
      }
      break
    }


    case 'POST': {
      let result = await create()
      if (result) {
        return res.status(status).send(items)
      } else {
        let sendObject = {
          'message': message,
          'items': items,
        }
        if (failedItems) {
          sendObject['failedItems'] = failedItems
        }
        return res.status(status).send(failedItems)
      }
      break
    }


    case 'PUT': {
      let result = await update()
      if (result) {
        return res.status(status).send(items)
      } else {
        let sendObject = {
          'message': message,
          'items': items,
        }
        if (failedItems) {
          sendObject['failedItems'] = failedItems
        }
        return res.status(status).send(failedItems)
      }
      break
    }

    case 'DELETE': {
      let result = await remove()
      if (result) {
        return res.status(status).send({'deleted':items})
      } else {
        let sendObject = {
          'message': message,
          'deleted': items,
        }
        if (failedItems) {
          sendObject['failedItems'] = failedItems
        }
        return res.status(status).send(sendObject)
      }
      break
    }
  }


}

var retrieve = async () => {
  console.log('textQueryObject', textQueryObject)
  console.log('queryObject', queryObject)
  try {
    items = await model
      .find(
        queryObject ? queryObject : {},
      )
      .populate(populateQuery)
      .sort(sortObject)
      .exec()
    status = 200
  } catch (e) {
    message = 'No items that fit the query:' + e
    status = 404
    return false
  }

  return true
}

var create = async () => {
  if (Array.isArray(reqData)) {
    //multicreate
  } else {
    //single create
    try {
      // await model
      items.push(await model.create(reqData))
      return status = 201
    } catch (e) {

    }
  }


}

var update = async () => {
  if (Array.isArray(reqData)) {
    //multicreate
  } else {
    //single create
    try {
      // await model
      items.push(await model.findByIdAndUpdate(reqData._id, reqData,{new:true,}))
      return status = 200
    } catch (e) {

    }
  }
}

var remove = async () => {
  if (Array.isArray(reqData)) {
    //multicreate
  } else {
    //single create
    try {
      // await model
      items.push(await model.findOneAndRemove({"_id":reqData._id}))
      return status = 410
    } catch (e) {
      console.log(e)
    }
  }
}


module.exports = {
  processRequest: processRequest
}
