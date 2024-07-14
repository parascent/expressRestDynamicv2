const fs  = require('fs')


module.exports = []

fs.readdirSync(__dirname).forEach(function (file) {
  if (file !== 'index.js') {
    var moduleName = file.split('.')[0];
    module.exports[moduleName.toLowerCase()] = require('./' + moduleName)
  }
})

