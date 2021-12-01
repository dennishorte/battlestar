const { transitionFactory2 } = require('./factory.js')
const bsgutil = require('../util.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'launch',
      func: _launch,
    },
    {
      name: 'action',
      func: _action
    },
  ],
})

function _launch(context) {
  return context.push('launch-self-in-viper', {
    playerName: context.data.playerName
  })
}

function _action(context) {
  return context.push('player-turn-action', {
    playerName: context.data.playerName
  })
}
