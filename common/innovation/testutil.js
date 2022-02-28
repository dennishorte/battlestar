const { GameOverEvent } = require('./game.js')
const { InnovationFactory } = require('./innovation.js')
const log = require('./log.js')


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
    key: request1.key
  })
  game.respondToInputRequest({
    actor: 'micah',
    title: 'Choose First Card',
    selection: ['Code of Laws'],
    key: request1.key
  })
  if (game.settings.numPlayers >= 3) {
    game.respondToInputRequest({
      actor: 'scott',
      title: 'Choose First Card',
      selection: ['Sailing'],
      key: request1.key
    })
  }
  if (game.settings.numPlayers >= 4) {
    game.respondToInputRequest({
      actor: 'eliya',
      title: 'Choose First Card',
      selection: ['Writing'],
      key: request1.key
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
  const actionChoices = request.selectors[0].choices.find(c => c.name === action).choices
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

TestUtil.testIsSecondPlayer = function(request) {
  const selector = request.selectors[0]
  expect(selector.actor).toBe('micah')
  expect(selector.title).toBe('Choose First Action')
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

        if (playerBoard.score) {
          TestUtil.setScore(game, name, playerBoard.score)
        }

        if (playerBoard.achievements) {
          TestUtil.setAchievements(game, name, playerBoard.achievements)
        }

        if (playerBoard.forecast) {
          TestUtil.setForecast(game, name, playerBoard.forecast)
        }

        if (playerBoard.hand) {
          TestUtil.setHand(game, name, playerBoard.hand)
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

  for (const zone of ['hand', 'score', 'forecast', 'achievements']) {
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

    for (const zone of ['hand', 'score', 'forecast', 'achievements']) {
      realBoard[zone] = game.getCardsByZone(player, zone).map(c => c.name).sort()
    }

    expected[player.name] = expectedBoard
    real[player.name] = realBoard
  }

  expect(real).toStrictEqual(expected)
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

TestUtil.choose = function(game, request, ...selections) {
  const selector = request.selectors[0]
  selections = selections.map(string => {
    const tokens = typeof string === 'string' ? string.split('.') : [string]
    if (tokens.length === 1) {
      return tokens[0]
    }
    else if (tokens.length === 2) {
      return {
        name: tokens[0],
        selection: tokens[1] === '*' ? [] : [tokens[1]]
      }
    }
    else {
      throw new Error(`Selection is too deep: ${string}`)
    }
  })

  return game.respondToInputRequest({
    actor: selector.actor,
    title: selector.title,
    selection: selections,
    key: request.key,
  })
}

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
    .find(c => c.name === kind)
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
    if (!card.isSpecialAchievement) {
      game.mMoveCardTo(card, game.getZoneById(card.home))
    }
  }

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

TestUtil.setForecast = function(game, playerName, cardNames) {
  TestUtil.clearHand(game, playerName)
  const player = game.getPlayerByName(playerName)
  const forecast = game.getZoneByPlayer(player, 'forecast')
  for (const name of cardNames) {
    const card = game.getCardByName(name)
    game.mMoveCardTo(card, forecast)
  }
}

TestUtil.setHand = function(game, playerName, cardNames) {
  TestUtil.clearHand(game, playerName)
  const player = game.getPlayerByName(playerName)
  const hand = game.getZoneByPlayer(player, 'hand')
  for (const name of cardNames) {
    const card = game.getCardByName(name)
    game.mMoveCardTo(card, hand)
  }
}

TestUtil.setScore = function(game, playerName, cardNames) {
  TestUtil.clearZone(game, playerName, 'score')
  const player = game.getPlayerByName(playerName)
  const score = game.getZoneByPlayer(player, 'score')
  for (const name of cardNames) {
    const card = game.getCardByName(name)
    game.mMoveCardTo(card, score)
  }
}

TestUtil.setSplay = function(game, playerName, color, direction) {
  const player = game.getPlayerByName(playerName)
  const zone = game.getZoneByPlayer(player, color)
  zone.splay = direction
}


////////////////////////////////////////////////////////////////////////////////
// State Inspectors

TestUtil.deepLog = function(obj) {
  console.log(JSON.stringify(obj, null, 2))
}

TestUtil.dumpLog = function(game) {
  const output = []
  for (const entry of game.getLog()) {
    if (entry === '__INDENT__' || entry === '__OUTDENT__') {
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
