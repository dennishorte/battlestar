const sliceGenerator = require('./sliceGenerator.js')
const draftEngine = require('./draftEngine.js')

module.exports = {
  ...sliceGenerator,
  ...draftEngine,
}
