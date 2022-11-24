const { GameOverEvent } = require('../lib/game.js')
const { MagicFactory } = require('./magic.js')
const cardLookup = require('./test_cardlookup.js')
const log = require('../lib/log.js')


const TestUtil = {}

TestUtil.fixture = function(options) {
  options = Object.assign({
    name: 'test_game',
    seed: 'test_seed',
    expansions: ['base'],
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
    ]
  }, options)

  options.players = options.players.slice(0, options.numPlayers)

  const game = MagicFactory(options, 'dennis')
  game.cardLookup = cardLookup

  game.testSetBreakpoint('initialization-complete', (game) => {
    // Set turn order
    game.state.players = ['dennis', 'micah', 'scott', 'eliya']
      .slice(0, game.settings.numPlayers)
      .map(name => game.getPlayerByName(name))
      .filter(p => p !== undefined)
  })

  return game
}

const convertNameToCard = (zone) => (name) => ({ name, zone })

TestUtil.fixtureDecksSelected = function(options) {
  const game = this.fixture(options)
  const request1 = game.run()

  game.respondToInputRequest({
    actor: 'dennis',
    title: 'Choose Deck',
    deckData: {
      _id: 'test_deck_dennis',
      name: 'test_deck_dennis',
      path: '/',
      kind: 'deck',
      cardlist: [
        'plains',
        'plains',
        'Benalish Hero',
        'White Knight',
        'Advance Scout',
        'Tithe',
        'Holy Strength',
      ].map(convertNameToCard('main'))
    },
    key: request1.key
  })

  game.respondToInputRequest({
    actor: 'micah',
    title: 'Choose Deck',
    deckData: {
      _id: 'test_deck_micah',
      name: 'test_deck_micah',
      path: '/',
      kind: 'deck',
      cardlist: [
        'mountain',
        'mountain',
        'shock',
        'lightning bolt',
        'goblin balloon brigade',
        'akki ember-keeper',
        'agility',
      ].map(convertNameToCard('main'))
    },
    key: request1.key
  })

  if (game.settings.numPlayers >= 3) {
    throw new Error('Deck selection is not set up for 3+ players')
  }

  return game
}

TestUtil.setBoard = function(game, state) {
  game.testSetBreakpoint('before-first-player', (game) => {
    for (const name of ['dennis', 'micah', 'scott', 'eliya']) {
    }
  })
}

TestUtil.testBoard = function(game, state) {
  const expected = {}
  const real = {}

  for (const [key, value] of Object.entries(state)) {
    const player = game.getPlayerByName(key)
    if (player) {
      expected[player.name] = {}
      real[player.name] = {}

      for (const [zone, content] of Object.entries(value)) {
        if (zone === 'life') {
          expected.life = content
          real.life = player.getCounter('life')
        }

        else {
          // Insert expected value
          expected[player.name][zone] = content
            .map(name => name.toLowerCase())
            .sort()

          // Insert real value
          real[player.name][zone] = game
            .getCardsByZone(player, zone)
            .map(c => c.name.toLowerCase())
            .sort()
        }
      }
    }
  }

  expect(real).toStrictEqual(expected)
}

TestUtil.do = function(game, request, action) {
  const selector = request.selectors[0]

  return game.respondToInputRequest({
    actor: selector.actor,
    title: selector.title,
    selection: [action],
    key: request.key,
  })
}


////////////////////////////////////////////////////////////////////////////////
// Data Shortcuts

TestUtil.dennis = function(game) {
  return game.getPlayerByName('dennis')
}


////////////////////////////////////////////////////////////////////////////////
// State Inspectors

TestUtil.deepLog = function(obj) {
  console.log(JSON.stringify(obj, null, 2))
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
