const { simpleFactory, stepFactory } = require('../../lib/transitionFactory.js')

const transitions = {
  root: {
    func: stepFactory([
      'initialize',
      'first-picks',
      'main',
      'END'
    ]),
  },

  'initialize': {
    func: require('./initialize.js')
  },

  'first-picks': {
    func: require('./firstPicks.js')
  },

  'main': {
    func: require('./main.js')
  },
}

module.exports = transitions
