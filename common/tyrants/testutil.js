const { GameOverEvent } = require('../lib/game.js')
const { TyrantsFactory } = require('./tyrants.js')
const log = require('../lib/log.js')
const util = require('../lib/util.js')


const TestUtil = {}

TestUtil.fixture = function(options) {
  options = Object.assign({
    name: 'test_game',
    seed: 'test_seed',
    expansions: ['drow', 'dragons'],
    map: undefined,
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
  options.map = options.map || (
    options.numPlayers === 3 ? 'base-3a' : `base-${options.numPlayers}`
  )

  const game = TyrantsFactory(options, 'dennis')

  game.testSetBreakpoint('initialization-complete', (game) => {
    // Set turn order
    game.state.players = ['dennis', 'micah', 'scott', 'eliya']
      .slice(0, game.settings.numPlayers)
      .map(name => game.getPlayerByName(name))
      .filter(p => p !== undefined)

    for (const player of game.getPlayerAll()) {
      const deck = game.getZoneByPlayer(player, 'deck')
      const hand = game.getZoneByPlayer(player, 'hand')

      // Fill player hands with Nobles
      for (const card of hand.cards()) {
        game.mMoveCardTo(card, deck)
      }
      while (hand.cards().length < 5) {
        const card = deck.cards().find(card => card.name === 'Noble')
        game.mMoveCardTo(card, hand)
      }

      // Put cards with multiple copies into the market. This makes sure that when we put cards
      // in player hands, we aren't grabbing them from the market.
      const marketDeck = game.getZoneById('marketDeck')
      const market = game.getZoneById('market')
      for (const card of market.cards()) {
        game.mMoveCardTo(card, marketDeck, { silent: true })
      }
      const cardNames = [
        'Advocate',
        'Blackguard',
        'Bounty Hunter',
        'Doppelganger',
        'Infiltrator',
        'Spellspinner',
      ]
      for (const name of cardNames) {
        const card = game.getZoneById('marketDeck').cards().find(c => c.name === name)
        game.mMoveCardTo(card, market, { silent: true })
      }
    }

  })

  return game
}

TestUtil.gameFixture = function(options) {
  const game = this.fixture(options)

  game.testSetBreakpoint('initialization-complete', (game) => {
    game.mLog({ template: 'SETUP' })
    game.mLogIndent()

    for (const player of game.getPlayerAll()) {
      game.mLog({
        template: '{player} setup',
        args: { player }
      })
      game.mLogIndent()

      const playerSetup = options[player.name]
      if (playerSetup) {

        for (const key of ['hand', 'innerCircle', 'deck']) {

          if (playerSetup[key]) {
            game.mLog({
              template: '{key}',
              args: { key },
            })
            game.mLogIndent()

            const zone = game.getZoneByPlayer(player, key)

            for (const card of zone.cards()) {
              const deck = key === 'deck' ? game.getZoneById('devoured') : game.getZoneByHome(card)
              game.mMoveCardTo(card, deck)
            }

            for (const name of playerSetup[key]) {
              game.mLog({
                template: '{name}',
                args: { name },
              })

              if (name === 'Priestess of Lolth') {
                game.mMoveCardTo(game.getZoneById('priestess').cards()[0], zone)
              }
              else if (name === 'House Guard') {
                game.mMoveCardTo(game.getZoneById('guard').cards()[0], zone)
              }
              else if (name === 'Insane Outcast') {
                game.mMoveCardTo(game.getZoneById('outcast').cards()[0], zone)
              }
              else {
                const card = game.getZoneById('marketDeck').cards().find(card => card.name === name)
                util.assert(!!card, `Card not found: ${name}`)
                game.mMoveCardTo(card, zone)
              }
            }

            game.mLogOutdent()
          }
        }

        if (playerSetup.trophyHall) {
          TestUtil.setTroops(game, game.getZoneByPlayer(player, 'trophyHall').id, playerSetup.trophyHall)
        }

        if (playerSetup.power) {
          player.power = playerSetup.power
        }
        if (playerSetup.influence) {
          player.influence = playerSetup.influence
        }
        if (playerSetup.points) {
          player.points = playerSetup.points
        }
      }

      else {
        game.mLog({ template: 'no setup info' })
      }

      game.mLogOutdent()
    }

    for (const loc of game.getLocationAll()) {
      if (options[loc.name]) {
        game.mLog({ template: loc.name })
        game.mLogIndent()

        const data = options[loc.name]
        if (data.troops) {
          game.mLog({
            template: 'Setting troops at {name} to [{troops}]',
            args: {
              name: loc.name,
              troops: data.troops.join(', ')
            }
          })
          TestUtil.setTroops(game, loc.id, data.troops)
        }

        if (data.spies) {
          game.mLog({
            template: 'Setting troops at {name} to [{spies}]',
            args: {
              name: loc.name,
              spies: data.spies.join(', ')
            }
          })
          TestUtil.setSpies(game, loc.id, data.spies)
        }

        game.mLogOutdent()
      }
    }

    game.mLogOutdent()
  })

  const request1 = game.run()

  const request2 = game.respondToInputRequest({
    actor: 'dennis',
    title: 'Choose starting location',
    selection: ['Ched Nasad'],
    key: request1.key
  })

  game.respondToInputRequest({
    actor: 'micah',
    title: 'Choose starting location',
    selection: ['Eryndlyn'],
    key: request2.key
  })

  return game
}

/*
   locName: Either a string matching the name of a location, or a Zone.
 */
TestUtil.setTroops = function(game, locId, playerNames) {
  game.testSetBreakpoint('initialization-complete', (game) => {

    if (!locId.includes('.')) {
      locId = 'map.' + locId
    }

    const zone = game.getZoneById(locId)

    for (const card of zone.cards()) {
      if (card.isTroop) {
        const home = game.getZoneByHome(card)
        game.mMoveCardTo(card, home)
      }
    }

    for (const playerName of playerNames) {
      if (playerName === 'neutral') {
        const tokens = game.getZoneById('neutrals').cards()
        game.mMoveCardTo(tokens[0], zone)
      }
      else {
        const player = game.getPlayerByName(playerName)
        const tokens = game.getCardsByZone(player, 'troops')
        game.mMoveCardTo(tokens[0], zone)
      }
    }
  })
}

TestUtil.setSpies = function(game, locId, playerNames) {
  game.testSetBreakpoint('initialization-complete', (game) => {

    if (!locId.includes('.')) {
      locId = 'map.' + locId
    }

    const zone = game.getZoneById(locId)

    for (const card of zone.cards()) {
      if (card.isSpy) {
        const home = game.getZoneByHome(card)
        game.mMoveCardTo(card, home)
      }
    }

    while (zone.getSpies().length > 0) {
      const spy = zone.getSpies()[0]
      game.mMoveCardTo(spy, game.getZoneByHome(spy))
    }

    for (const playerName of util.array.distinct(playerNames)) {
      const player = game.getPlayerByName(playerName)
      const tokens = game.getCardsByZone(player, 'spies')
      game.mMoveCardTo(tokens[0], zone)
    }
  })
}


////////////////////////////////////////////////////////////////////////////////
// Tests

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

TestUtil.testIsSecondPlayer = function(request) {
  const selector = request.selectors[0]
  expect(selector.actor).toBe('micah')
  expect(selector.title).toBe('Choose First Action')
}

TestUtil.testGameOver = function(request, playerName, reason) {
  expect(request).toEqual(expect.any(GameOverEvent))
  expect(request.data.player.name).toBe(playerName)
  expect(request.data.reason).toBe(reason)
}

TestUtil.testNotGameOver = function(request) {
  expect(request).not.toEqual(expect.any(GameOverEvent))
}

TestUtil.testTroops = function(game, locationName, expected) {
  const location = game.getLocationByName(locationName)
  const troops = location.getTroops().map(t => t.owner.name).sort()
  expected = expected.sort()

  expect(troops).toStrictEqual(expected)
}

TestUtil.testBoard = function(game, expected) {
  for (const [key, value] of Object.entries(expected)) {
    const player = game.getPlayerByName(key)
    const location = game.getLocationByName(key)

    if (player) {
      this.testTableau(game, player, value)
    }

    else if (location) {
      this.testLocation(game, location, value)
    }

    else if (key === 'devoured') {
      const actual = game.getZoneById('devoured').cards().map(c => c.name).sort()
      const expected = value.sort()
      expect(actual).toStrictEqual(expected)
    }

    else if (key === 'market') {
      const actual = game.getZoneById('devoured').cards().map(c => c.name).sort()
      const expected = value.sort()
      expect(actual).toStrictEqual(expected)
    }

    else {
      throw new Error(`Unhandled test key: ${key}`)
    }
  }
}

const tableauZones = [
  'played',
  'discard',
  'trophyHall',
  'hand',
  'innerCircle',
]

const numericValues = [
  'influence',
  'points',
  'power',
]

TestUtil.testTableau = function(game, player, testState) {
  const actual = {}
  const expected = {}

  for (const zoneName of tableauZones) {
    actual[zoneName] = game.getCardsByZone(player, zoneName).map(c => c.name).sort()

    if (!testState[zoneName] || testState[zoneName] === 'default') {
      if (zoneName === 'hand') {
        expected[zoneName] = ['Noble', 'Noble', 'Noble', 'Soldier', 'Soldier'].sort()
      }
      else {
        expected[zoneName] = []
      }
    }
    else {
      expected[zoneName] = (testState[zoneName] || []).sort()
    }
  }

  for (const key of numericValues) {
    actual[key] = player[key]
    expected[key] = testState[key] || 0
  }

  expect(actual).toStrictEqual(expected)
}

TestUtil.testLocation = function(game, location, testState) {
  const actual = { name: location.name }
  const expected = { name: location.name }

  for (const key of ['troops', 'spies']) {
    actual[key] = location.getTokens(key).map(t => t.getOwnerName()).sort()
    expected[key] = (testState[key] || []).sort()
  }

  expect(actual).toStrictEqual(expected)
}


////////////////////////////////////////////////////////////////////////////////
// Data Shortcuts

TestUtil.dennis = function(game) {
  return game.getPlayerByName('dennis')
}

////////////////////////////////////////////////////////////////////////////////
// Handy functions

TestUtil.choose = function(game, request, ...selections) {
  const selector = request.selectors[0]
  selections = selections.map(string => {
    if (typeof string === 'string' && string.startsWith('*')) {
      return string.slice(1)
    }

    const tokens = typeof string === 'string' ? string.split('.') : [string]

    if (tokens.length === 1) {
      return tokens[0]
    }
    else if (tokens.length === 2) {
      return {
        title: tokens[0],
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
