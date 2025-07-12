const { GameOverEvent } = require('../lib/game.js')
const { TyrantsFactory } = require('./tyrants.js')
const TestCommon = require('../lib/test_common.js')
const util = require('../lib/util.js')


const TestUtil = { ...TestCommon }

TestUtil.fixture = function(options) {
  options = Object.assign({
    name: 'test_game',
    seed: 'test_seed',
    expansions: ['drow', 'dragons'],
    map: undefined,
    numPlayers: 2,
    chooseColors: false,
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
    playerOptions: {
      shuffleSeats: false,
    },
  }, options)

  options.players = options.players.slice(0, options.numPlayers)
  options.map = options.map || (
    options.numPlayers === 3 ? 'base-3a' : `base-${options.numPlayers}`
  )

  const game = TyrantsFactory(options, 'dennis')

  game.testSetBreakpoint('initialization-complete', (game) => {
    for (const player of game.players.all()) {
      const deck = game.zones.byPlayer(player, 'deck')
      const hand = game.zones.byPlayer(player, 'hand')

      // Return all cards in the player hand to their deck
      for (const card of hand.cards()) {
        card.moveTo(deck)
      }

      // Put 5 nobles into the player hand
      while (hand.cards().length < 5) {
        const card = deck.cards().find(card => card.name === 'Noble')
        card.moveTo(hand)
      }

      // Put the remainder of the deck into a fixed order
      deck._cards.sort((l, r) => r.name.localeCompare(l.name))

      // Put cards with multiple copies into the market. This makes sure that when we put cards
      // in player hands, we aren't grabbing them from the market.
      const marketDeck = game.zones.byId('marketDeck')
      const market = game.zones.byId('market')
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
        const card = game.zones.byId('marketDeck').cards().find(c => c.name === name)
        game.mMoveCardTo(card, market, { silent: true })
      }
    }
  })

  return game
}

TestUtil.gameFixture = function(options) {
  const game = this.fixture(options)

  game.testSetBreakpoint('initialization-complete', (game) => {
    game.log.add({ template: 'SETUP' })
    game.log.indent()

    for (const player of game.players.all()) {
      game.log.add({
        template: '{player} setup',
        args: { player }
      })
      game.log.indent()

      const playerSetup = options[player.name]
      if (playerSetup) {

        for (const key of ['hand', 'innerCircle', 'deck', 'discard', 'played']) {

          if (playerSetup[key]) {
            game.log.add({
              template: '{key}',
              args: { key },
            })
            game.log.indent()

            const zone = game.zones.byPlayer(player, key)

            for (const card of zone.cards()) {
              const deck = key === 'deck' ? game.zones.byId('devoured') : card.home
              card.moveTo(deck)
            }

            for (const name of playerSetup[key]) {
              game.log.add({
                template: '{name}',
                args: { name },
              })

              let card
              if (name === 'Priestess of Lolth') {
                card = game.zones.byId('priestess').peek()
              }
              else if (name === 'House Guard') {
                card = game.zones.byId('guard').peek()
                game.mMoveCardTo(game.zones.byId('guard').cards()[0], zone)
              }
              else if (name === 'Insane Outcast') {
                card = game.zones.byId('outcast').peek()
              }
              else {
                card = game.cards.byZone('marketDeck').find(card => card.name === name)
                util.assert(!!card, `Card not found: ${name}`)
              }

              card.moveTo(zone)
              card.owner = player
            }

            game.log.outdent()
          }
        }

        if (playerSetup.trophyHall) {
          TestUtil.setTroops(game, game.zones.byPlayer(player, 'trophyHall').id, playerSetup.trophyHall)
        }

        if ('power' in playerSetup) {
          player.setCounter('power', playerSetup.power)
        }
        if ('influence' in playerSetup) {
          player.setCounter('influence', playerSetup.influence)
        }
        if ('points' in playerSetup) {
          player.setCounter('points', playerSetup.points)
        }
        if ('troops' in playerSetup) {
          // Need to keep an extra troop for initial location selection.
          const troops = game.getCardsByZone(player, 'troops').slice(playerSetup.troops + 1)
          const exile = game.zones.byId('devoured')
          for (const troop of troops) {
            game.mMoveCardTo(troop, exile)
          }
        }
      }

      else {
        game.log.add({ template: 'no setup info' })
      }

      game.log.outdent()
    }

    for (const loc of game.getLocationAll()) {
      if (options[loc.name()]) {
        game.log.add({ template: loc.name() })
        game.log.indent()

        const data = options[loc.name()]
        if (data.troops) {
          game.log.add({
            template: 'Setting troops at {name} to [{troops}]',
            args: {
              name: loc.name(),
              troops: data.troops.join(', ')
            }
          })
          TestUtil.setTroops(game, loc.id, data.troops)
        }

        if (data.spies) {
          game.log.add({
            template: 'Setting troops at {name} to [{spies}]',
            args: {
              name: loc.name(),
              spies: data.spies.join(', ')
            }
          })
          TestUtil.setSpies(game, loc.id, data.spies)
        }

        game.log.outdent()
      }
    }

    if (options.devoured) {
      const devoured = game.zones.byId('devoured')
      const market = game.zones.byId('marketDeck')
      for (const name of options.devoured) {
        const card = market.cards().find(card => card.name === name)
        game.mMoveCardTo(card, devoured, { verbose: true })
      }
    }

    if (options.marketDeck) {
      game.log.add({ template: 'setting up market' })
      game.log.indent()

      const market = game.zones.byId('marketDeck')
      const cards = market.cards()
      const toMove = []

      for (const name of options.marketDeck) {
        game.log.add({ template: 'searching for: ' + name })
        const card = cards.find(c => c.name === name && !toMove.includes(c))
        if (!card) {
          throw new Error('Unable to find card: ' + name)
        }
        toMove.push(card)
      }

      toMove.reverse()
      for (const card of toMove) {
        game.mMoveCardTo(card, market, { index: 0, verbose: true })
      }

      // const topOfMarket = market.cards().slice(0, 5).map(c => c.name).join(',')
      // game.log.add({ template: topOfMarket })

      game.log.outdent()
    }

    game.log.outdent()
  })


  let request = game.run()
  request = this.choose(game, request, 'Ched Nasad')
  request = this.choose(game, request, 'Eryndlyn')
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

    const zone = game.zones.byId(locId)

    for (const card of zone.cards()) {
      if (card.isTroop) {
        const home = game.getZoneByHome(card)
        game.mMoveCardTo(card, home)
      }
    }

    for (const playerName of playerNames) {
      if (playerName === 'neutral') {
        const tokens = game.zones.byId('neutrals').cards()
        game.mMoveCardTo(tokens[0], zone)
      }
      else {
        const player = game.players.byName(playerName)
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

    const zone = game.zones.byId(locId)

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
      const player = game.players.byName(playerName)
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
    const player = game.players.byName(key)
    const location = game.getLocationByName(key)

    if (player) {
      this.testTableau(game, player, value)
    }

    else if (location) {
      this.testLocation(game, location, value)
    }

    else if (key === 'devoured') {
      const actual = game.zones.byId('devoured').cards().map(c => c.name).sort()
      const expected = value.sort()
      expect(actual).toStrictEqual(expected)
    }

    else if (key === 'market') {
      const actual = game.zones.byId('market').cards().map(c => c.name).sort()
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

const counters = [
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
        expected[zoneName] = ['Noble', 'Noble', 'Soldier', 'Soldier', 'Soldier'].sort()
      }
      else {
        expected[zoneName] = []
      }
    }
    else {
      expected[zoneName] = (testState[zoneName] || []).sort()
    }
  }

  for (const key of counters) {
    actual[key] = player.getCounter(key)
    expected[key] = testState[key] || 0
  }

  if ('score' in testState) {
    actual['score'] = game.getScore(player)
    expected['score'] = testState['score']
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

module.exports = TestUtil
