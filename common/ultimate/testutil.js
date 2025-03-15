const { GameOverEvent } = require('../lib/game.js')
const { InnovationFactory } = require('./innovation.js')
const TestCommon = require('../lib/test_common.js')
const log = require('../lib/log.js')


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

  const game = InnovationFactory(options, 'dennis')

  game.testSetBreakpoint('initialization-complete', (game) => {
    // Set turn order
    game.state.players = ['dennis', 'micah', 'scott', 'eliya']
      .slice(0, game.settings.numPlayers)
      .map(name => game.getPlayerByName(name))
      .filter(p => p !== undefined)

    // Set initial cards in hand
    TestUtil.clearHands(game)
    TestUtil.setHand(game, 'dennis', ['Archery', 'Domestication'])
    TestUtil.setHand(game, 'micah', ['Mysticism', 'Code of Laws'])
    if (options.numPlayers >= 3) {
      TestUtil.setHand(game, 'scott', ['Sailing', 'The Wheel'])
    }
    if (options.numPlayers >= 4) {
      TestUtil.setHand(game, 'eliya', ['Oars', 'Writing'])
    }

    // If using Unseen, remove the special achievements.
    // These are so easy to claim in test scenarios that they break dozens of tests.
    if (game.getExpansionList().includes('usee')) {
      const unseenAchievementNames = [
        'Anonymity',
        'Confidence',
        'Folklore',
        'Mystery',
        'Zen',
      ]
      for (const name of unseenAchievementNames) {
        game.mRemove(game.getCardByName(name))
      }
    }
  })

  return game
}

TestUtil.fixtureDecrees = function(options={}) {
  options.expansions = options.expansions || ['base', 'figs']
  const game = TestUtil.fixtureFirstPlayer(options)
  game.testSetBreakpoint('before-first-player', (game) => {
    TestUtil.setHand(game, 'dennis', ['Homer', 'Ptolemy', 'Yi Sun-Sin', 'Daedalus', 'Ximen Bao'])
  })
  return game
}

TestUtil.fixtureFirstPlayer = function(options) {
  const game = TestUtil.fixture(options)
  const request1 = game.run()
  game.respondToInputRequest({
    actor: 'dennis',
    title: 'Choose First Card',
    selection: ['Archery'],
  })
  game.respondToInputRequest({
    actor: 'micah',
    title: 'Choose First Card',
    selection: ['Code of Laws'],
  })
  if (game.settings.numPlayers >= 3) {
    game.respondToInputRequest({
      actor: 'scott',
      title: 'Choose First Card',
      selection: ['Sailing'],
    })
  }
  if (game.settings.numPlayers >= 4) {
    game.respondToInputRequest({
      actor: 'eliya',
      title: 'Choose First Card',
      selection: ['Writing'],
    })
  }

  game.testSetBreakpoint('before-first-player', (game) => {
    TestUtil.clearBoards(game)
    TestUtil.clearHands(game)
  })

  return game
}

TestUtil.fixtureTopCard = function(cardName, options) {
  const game = TestUtil.fixtureFirstPlayer(options)
  game.testSetBreakpoint('before-first-player', (game) => {
    game
      .getPlayerAll()
      .forEach(player => TestUtil.clearBoard(game, player.name))

    const card = game.getCardByName(cardName)
    TestUtil.setColor(game, game.getPlayerCurrent().name, card.color, [cardName])
  })
  return game
}

TestUtil.testActionChoices = function(request, action, expected) {
  const actionChoices = request.selectors[0].choices.find(c => c.title === action).choices
  expect(actionChoices.sort()).toStrictEqual(expected.sort())
}

TestUtil.testChoices = function(request, expected, expectedMin, expectedMax) {
  const choices = request.selectors[0].choices.filter(c => c !== 'auto').sort()
  expect(choices).toStrictEqual(expected.sort())

  if (expectedMax) {
    const { min, max } = request.selectors[0]
    expect(min).toBe(expectedMin)
    expect(max).toBe(expectedMax)
  }

  // This is actually just count
  else if (expectedMin) {
    expect(request.selectors[0].count).toBe(expectedMin)
  }
}

TestUtil.testIsFirstAction = function(request) {
  const selector = request.selectors[0]
  expect(selector.actor).toBe('dennis')
  expect(selector.title).toBe('Choose First Action')
}

TestUtil.testIsSecondPlayer = function(game) {
  const request = game.waiting
  const selector = request.selectors[0]
  expect(selector.actor).toBe('micah')
  expect(selector.title).toBe('Choose First Action')
}

TestUtil.testDeckIsJunked = function(game, age) {
  const cardsInDeck = game.getZoneByDeck('base', age).cards()
  expect(cardsInDeck.length).toBe(0)
}

TestUtil.testDecreeForTwo = function(figureName, decreeName) {
  const game = TestUtil.fixtureTopCard(figureName, { expansions: ['base', 'figs'] })
  game.testSetBreakpoint('before-first-player', (game) => {
    TestUtil.setHand(game, 'dennis', ['Homer', 'Ptahotep'])
  })
  const request1 = game.run()
  expect(TestUtil.getChoices(request1, 'Decree')).toStrictEqual([decreeName])
}

TestUtil.testNoFade = function(cardName) {
  const game = TestUtil.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
  game.testSetBreakpoint('before-first-player', (game) => {
    TestUtil.setColor(game, 'dennis', 'blue', ['Albert Einstein'])
    TestUtil.setColor(game, 'dennis', 'purple', ['Al-Kindi'])
    TestUtil.setColor(game, 'dennis', 'green', ['Adam Smith'])

    const targetCard = game.getCardByName(cardName)
    TestUtil.setColor(game, 'dennis', targetCard.color, [targetCard.id])
  })

  const request1 = game.run()
  const request2 = TestUtil.choose(game, request1, 'Draw.draw a card')

  TestUtil.testIsSecondPlayer(request2)
}

TestUtil.testZone = function(game, zoneName, expectedCards, opts={}) {
  const zoneCards = TestUtil.cards(game, zoneName, opts.player)
  if (opts.sort || !game.utilColors().includes(zoneName)) {
    zoneCards.sort()
    expectedCards.sort()
  }
  expect(zoneCards).toStrictEqual(expectedCards)
}

TestUtil.setBoard = function(game, state) {
  game.testSetBreakpoint('before-first-player', (game) => {
    if (state.achievements) {
      TestUtil.setAvailableAchievements(game, state.achievements)
    }

    if (state.junk) {
      TestUtil.setJunk(game, state.junk)
    }

    for (const name of ['dennis', 'micah', 'scott', 'eliya']) {
      const playerBoard = state[name]
      if (playerBoard) {
        for (const color of game.utilColors()) {
          if (playerBoard[color]) {
            const cards = playerBoard[color].cards || playerBoard[color]
            TestUtil.setColor(game, name, color, cards)

            if (playerBoard[color].splay) {
              TestUtil.setSplay(game, name, color, playerBoard[color].splay)
            }
          }
        }

        for (const zoneName of ['artifact', 'score', 'achievements', 'forecast', 'hand', 'safe', 'museum']) {
          if (zoneName in playerBoard) {
            TestUtil.setPlayerZone(game, name, zoneName, playerBoard[zoneName])
          }
        }
      }
    }

    const decks = state.decks || {}
    for (const exp of Object.keys(decks)) {
      for (const [age, cards] of Object.entries(decks[exp])) {
        TestUtil.setDeckTop(game, exp, parseInt(age), cards)
      }
    }
  })
}

function _blankTableau() {
  return {
    hand: [],
    achievements: [],
    score: [],
    forecast: [],
    artifact: [],
    museum: [],
    safe: [],
    red: [],
    yellow: [],
    green: [],
    blue: [],
    purple: [],
  }
}

function _buildPlayerBoard(game, opts) {
  const playerBoard = Object.assign(_blankTableau(), opts)

  for (const color of game.utilColors()) {
    if (Array.isArray(playerBoard[color])) {
      playerBoard[color] = {
        cards: playerBoard[color],
        splay: 'none'
      }
    }
  }

  for (const zone of ['hand', 'score', 'forecast', 'achievements', 'safe', 'museum']) {
    playerBoard[zone].sort()
  }

  return playerBoard
}

TestUtil.testBoard = function(game, state) {
  const expected = {}
  const real = {}

  for (const player of game.getPlayerAll()) {
    const expectedBoard = _buildPlayerBoard(game, state[player.name])
    const realBoard = _blankTableau()

    for (const color of game.utilColors()) {
      const zone = game.getZoneByPlayer(player, color)
      const cards = zone.cards().map(card => card.name)
      realBoard[color] = {
        cards,
        splay: zone.splay
      }
    }

    for (const zone of ['artifact', 'hand', 'score', 'forecast', 'achievements', 'safe', 'museum']) {
      realBoard[zone] = game.getCardsByZone(player, zone).map(c => c.name).sort()
    }

    expected[player.name] = expectedBoard
    real[player.name] = realBoard
  }

  if (state.junk) {
    expected.junk = state.junk.sort()
    real.junk = game
      .getZoneById('junk')
      .cards()
      .filter(c => !(c.isSpecialAchievement && c.expansion === 'usee'))
      .map(c => c.name)
      .sort()
  }

  if (state.achievements) {
    expected.achievements = state.achievements.sort()
    real.achievements = game.getZoneById('achievements').cards().map(c => c.name).sort()
  }

  if (state.standardAchievements) {
    expected.standardAchievements = state.standardAchievements.sort()
    real.standardAchievements = game
      .getZoneById('achievements')
      .cards()
      .filter(c => c.checkIsStandardAchievement())
      .map(c => c.name)
      .sort()
  }

  expect(real).toStrictEqual(expected)
}

// Print out a representation of the current board state that can be used
// in TestUtil.setBoard.
TestUtil.dumpBoard = function(game) {
  const real = {}

  for (const player of game.getPlayerAll()) {
    const realBoard = _blankTableau()

    for (const color of game.utilColors()) {
      const zone = game.getZoneByPlayer(player, color)
      const cards = zone.cards().map(card => card.name)
      realBoard[color] = {
        cards,
        splay: zone.splay
      }
    }

    for (const zone of ['artifact', 'hand', 'score', 'forecast', 'achievements']) {
      realBoard[zone] = game.getCardsByZone(player, zone).map(c => c.name).sort()
    }

    real[player.name] = realBoard
  }

  real.junk = game.getZoneById('junk').cards().map(c => c.name).sort()
  real.achievements = game.getZoneById('achievements').cards().map(c => c.name).sort()

  return real
}

TestUtil.testGameOver = function(request, playerName, reason) {
  expect(request).toEqual(expect.any(GameOverEvent))
  expect(request.data.player.name).toBe(playerName)
  expect(request.data.reason).toBe(reason)
}

TestUtil.testNotGameOver = function(request) {
  expect(request).not.toEqual(expect.any(GameOverEvent))
}


////////////////////////////////////////////////////////////////////////////////
// Data Shortcuts

TestUtil.dennis = function(game) {
  return game.getPlayerByName('dennis')
}

TestUtil.cards = function(game, zoneName, playerName='dennis') {
  return TestUtil.zone(game, zoneName, playerName).cards().map(c => c.name)
}

TestUtil.zone = function(game, zoneName, playerName='dennis') {
  return game.getZoneByPlayer(game.getPlayerByName(playerName), zoneName)
}


////////////////////////////////////////////////////////////////////////////////
// Handy functions

TestUtil.clearZone = function(game, playerName, zoneName) {
  const player = game.getPlayerByName(playerName)
  const zone = game.getZoneByPlayer(player, zoneName)
  for (const card of zone.cards()) {
    game.mReturn(player, card, { silent: true })
  }
}

TestUtil.clearBoard = function(game, playerName) {
  const player = game.getPlayerByName(playerName)
  for (const color of game.utilColors()) {
    const zone = game.getZoneByPlayer(player, color)
    for (const card of zone.cards()) {
      game.mReturn(player, card, { silent: true })
    }
  }
}

TestUtil.clearBoards = function(game) {
  for (const player of game.getPlayerAll()) {
    TestUtil.clearBoard(game, player.name)
  }
}

TestUtil.clearHand = function(game, playerName) {
  const player = game.getPlayerByName(playerName)
  const cards = game.getZoneByPlayer(player, 'hand').cards()
  for (const card of cards) {
    game.mMoveCardTo(card, game.getZoneById(card.home))
  }
}

TestUtil.clearHands = function(game) {
  for (const player of game.getPlayerAll()) {
    TestUtil.clearHand(game, player.name)
  }
}

TestUtil.getChoices = function(request, kind) {
  return request
    .selectors[0]
    .choices
    .find(c => c.title === kind)
    .choices
}

TestUtil.setAchievements = function(game, playerName, cardNames) {
  const player = game.getPlayerByName(playerName)
  const zone = game.getZoneByPlayer(player, 'achievements')
  const cards = cardNames.map(name => game.getCardByName(name))
  for (const card of zone.cards()) {
    game.mReturn(player, card, { silent: true })
  }
  for (const card of cards) {
    game.mMoveCardTo(card, zone)
  }
}

TestUtil.setAvailableAchievements = function(game, cardNames) {
  const cards = cardNames.map(name => game.getCardByName(name))
  const zone = game.getZoneById('achievements')

  for (const card of zone.cards()) {
    if (card.checkIsStandardAchievement()) {
      game.mMoveCardTo(card, game.getZoneById(card.home))
    }
  }

  for (const card of cards) {
    game.mMoveCardTo(card, zone)
  }
}

TestUtil.setJunk = function(game, cardNames) {
  const cards = cardNames.map(name => game.getCardByName(name))
  const zone = game.getZoneById('junk')

  for (const card of cards) {
    game.mMoveCardTo(card, zone)
  }
}

TestUtil.setColor = function(game, playerName, colorName, cardNames) {
  const player = game.getPlayerByName(playerName)
  const zone = game.getZoneByPlayer(player, colorName)
  const cards = cardNames.map(name => game.getCardByName(name))
  for (const card of zone.cards()) {
    game.mReturn(player, card, { silent: true })
  }
  for (const card of cards) {
    game.mMoveCardTo(card, zone)
  }
}

TestUtil.setDeckTop = function(game, exp, age, cardNames) {
  const deck = game.getZoneByDeck(exp, age)
  const cards = cardNames
    .map(c => game.getCardByName(c))
    .reverse()
  for (const card of cards) {
    game.mMoveCardToTop(card, deck)
  }
}

TestUtil.setPlayerZone = function(game, playerName, zoneName, cardNames) {
  TestUtil.clearZone(game, playerName, zoneName)
  const player = game.getPlayerByName(playerName)
  const zone = game.getZoneByPlayer(player, zoneName)
  for (const name of cardNames) {
    const card = game.getCardByName(name)
    game.mMoveCardTo(card, zone)
  }
}

TestUtil.setHand = function(game, playerName, cardNames) {
  TestUtil.setPlayerZone(game, playerName, 'hand', cardNames)
}

TestUtil.setScore = function(game, playerName, cardNames) {
  TestUtil.setPlayerZone(game, playerName, 'score', cardNames)
}

TestUtil.setSplay = function(game, playerName, color, direction) {
  const player = game.getPlayerByName(playerName)
  const zone = game.getZoneByPlayer(player, color)
  zone.splay = direction
}

module.exports = TestUtil
