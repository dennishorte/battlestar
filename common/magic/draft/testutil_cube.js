const { GameOverEvent } = require('../../lib/game.js')
const { CubeDraftFactory } = require('./cube.js')
const cardLookupFunc = require('../test_cardlookup.js')
const log = require('../../lib/log.js')
const jsUtil = require('util')


const TestUtil = {}

TestUtil.fixture = function(options) {
  options = Object.assign({
    name: 'test_game',
    seed: 'test_seed',
    numPlayers: 2,
    players: [
      {
        _id: 'dennis_id',
        name: 'dennis',
      },
      {
        _id: 'micah_id',
        name: 'micah',
      },
      {
        _id: 'scott_id',
        name: 'scott',
      },
      {
        _id: 'eliya_id',
        name: 'eliya',
      },
    ],

    numPacks: 3,
    packs: [
      {
        owner: 'dennis',
        cards: [
          'advance scout',
          'agility',
          'akki ember-keeper',
        ],
      },
      {
        owner: 'dennis',
        cards: [
          'benalish hero',
          'goblin balloon brigade',
          'holy strength',
        ],
      },
      {
        owner: 'dennis',
        cards: [
          'advance scout',
          'agility',
          'akki ember-keeper',
        ],
      },
      {
        owner: 'micah',
        cards: [
          'lightning bolt',
          'mountain',
          'plains',
        ],
      },
      {
        owner: 'micah',
        cards: [
          'shock',
          'tithe',
          'white knight',
        ],
      },
      {
        owner: 'micah',
        cards: [
          'benalish hero',
          'advance scout',
          'lightning bolt',
        ],
      },
    ],
  }, options)

options.players = options.players.slice(0, options.numPlayers)
  options.packs = options.packs.slice(0, options.numPlayers * options.numPacks)

  const game = CubeDraftFactory(options, 'dennis')
  game.cardLookupFunc = cardLookupFunc

  game.testSetBreakpoint('initialization-complete', (game) => {
    // Set turn order
    game.state.players = ['dennis', 'micah', 'scott', 'eliya']
      .slice(0, game.settings.numPlayers)
      .map(name => game.getPlayerByName(name))
      .filter(p => p !== undefined)
  })

  return game
}

////////////////////////////////////////////////////////////////////////////////
// Data Shortcuts

TestUtil.dennis = function(game) {
  return game.getPlayerByName('dennis')
}


////////////////////////////////////////////////////////////////////////////////
// State Inspectors

TestUtil.deepLog = function(obj) {
  // console.log(JSON.stringify(obj, null, 2))
  console.log(jsUtil.inspect(obj))
}

TestUtil.dumpLog = function(game) {
  const output = []
  for (const entry of game.getLog()) {
    if (entry === '__INDENT__' || entry === '__OUTDENT__' || entry.type === 'response-received') {
      continue
    }
    output.push(log.toString(entry))
  }
  console.log(output.join('\n'))
}

function _dumpZonesRecursive(root, indent=0) {
  const output = []

  if (root.id) {
    output.push(root.id)
    for (const card of root.cards()) {
      output.push(`   ${card.id}`)
    }
  }

  else {
    for (const zone of Object.values(root)) {
      output.push(_dumpZonesRecursive(zone, indent+1))
    }
  }

  return output.join('\n')
}

TestUtil.dumpZones = function(root) {
  console.log(_dumpZonesRecursive(root))
}


module.exports = TestUtil
