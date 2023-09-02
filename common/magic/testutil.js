const { GameOverEvent } = require('../lib/game.js')
const { MagicFactory } = require('./magic.js')
const TestCommon = require('../lib/test_common.js')
const cardLookupFunc = require('./test_cardlookup.js')
const log = require('../lib/log.js')
const jsUtil = require('util')


const TestUtil = { ...TestCommon }

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
  })

  if (game.settings.numPlayers >= 3) {
    throw new Error('Deck selection is not set up for 3+ players')
  }

  game.testSetBreakpoint('decks-selected', (game) => {
    const dennis = game.getPlayerByName('dennis')
    const deck = game.getZoneByPlayer(dennis, 'library')
    const cards = deck.cards()
    deck._cards = [
      cards.find(c => c.name === 'White Knight'),
      cards.find(c => c.name === 'Benalish Hero'),
      cards.find(c => c.name === 'Advance Scout'),
      cards.find(c => c.name === 'Tithe'),
      cards.find(c => c.name === 'Holy Strength'),
      cards.find(c => c.id === 2), // plains
      cards.find(c => c.id === 3), // plains
    ]
  })

  return game
}

TestUtil.setBoard = function(game, state) {
  game.testSetBreakpoint('before-first-player', (game) => {
    for (const name of ['dennis', 'micah', 'scott', 'eliya']) {
    }
  })
}

function blankTableau() {
  return {
    life: 20,
    hand: [],
    battlefield: [],
    command: [],
    creatures: [],
    graveyard: [],
    exile: [],
    land: [],
    stack: [],
  }
}

const playerZones = [
  'hand',
  'battlefield',
  'command',
  'creatures',
  'graveyard',
  'exile',
  'land',
  'stack',
]

TestUtil.testBoard = function(game, state) {
  const expected = {}
  const real = {}

  // Fill in base values for everything to be tested.
  for (const player of game.getPlayerAll()) {
    expected[player.name] = blankTableau()
    real[player.name] = {}
    real[player.name].life = player.getCounter('life')

    for (const key of playerZones) {
      real[player.name][key] = game
        .getCardsByZone(player, key)
        .map(c => c.name.toLowerCase())
        .sort()
    }
  }

  // Update the expected values from the input state.
  for (const [key, value] of Object.entries(state)) {
    const player = game.getPlayerByName(key)
    if (player) {
      for (const [zone, content] of Object.entries(value)) {
        if (zone === 'life') {
          expected[player.name].life = content
        }

        else {
          expected[player.name][zone] = content
            .map(name => name.toLowerCase())
            .sort()
        }
      }
    }
  }

  /* console.log(real)
   * console.log(expected) */

  expect(real).toStrictEqual(expected)
}

TestUtil.testVisibility = function(card, ...names) {
  const actual = card
    .visibility
    .map(player => player.name.toLowerCase())
    .sort()
  const expected = names
    .map(name => name.toLowerCase())
    .sort()

  expect(expected).toStrictEqual(actual)
}

TestUtil.do = function(game, request, action) {
  const selector = request.selectors[0]

  return game.respondToInputRequest({
    actor: selector.actor,
    title: selector.title,
    selection: [action],
  })
}

module.exports = TestUtil
