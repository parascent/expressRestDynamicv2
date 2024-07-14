import mongoose from 'mongoose'

var schema = new mongoose.Schema({
    name: 'string',
    size: 'string'
})

var TestModel = mongoose.model('Tank', schema)

var TestModelProps = {

}

module.exports = {
  'model': TestModel,
  'modelProps': TestModelProps,
}
