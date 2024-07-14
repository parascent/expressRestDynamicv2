const mongoose = require('mongoose')

var Schema = mongoose.Schema;

var schema = new mongoose.Schema({
    name: 'string',
    size: 'string',
    testModel: [{ type: Schema.Types.ObjectId, ref: 'Tank' }]
})

var TestModelTwo = mongoose.model('TankTwo', schema)

var TestModelProps = {
  defaultPopulateQuery: [
    // { path: 'testModel', select: ['name']}
  ],
  defaultSelects: {},
}

module.exports = {
  'model': TestModelTwo,
  'modelProps' : TestModelProps
}
