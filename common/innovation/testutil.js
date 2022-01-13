const log = require('../lib/log.js')

const { factory } = require('./game.js')

const TestUtil = {}

TestUtil.deepLog = function(obj) {
  console.log(JSON.stringify(obj, null, 2))
}

TestUtil.fixture = function(options) {
  options = Object.assign({
    expansions: ['base'],
    numPlayers: 3,
    teams: false,
  }, options)

  const lobby = {
    game: 'Innovation',
    name: 'Test Lobby',
    options: {
      expansions: options.expansions,
      teams: options.teams,
    },
    users: [
      { _id: 0, name: 'dennis' },
      { _id: 1, name: 'micah' },
      { _id: 2, name: 'tom' },
      { _id: 3, name: 'eliya' },
    ],
  }

  // Cut off unwanted players
  lobby.users = lobby.users.slice(0, options.numPlayers)

  const game = factory(lobby)
  game.testOptions = options

  return game
}

TestUtil.fixtureDecrees = function(options) {
  const game = TestUtil.fixtureFirstPicks(options)
  const player = game.getWaiting()[0].actor
  game.rk.undo('Player Turn')
  TestUtil.setHand(game, player, ['Homer', 'Ptolemy', 'Yi Sun-Sin', 'Daedalus', 'Shennong'])
  return game
}

TestUtil.fixtureDogma = function(card, options) {
  const game = TestUtil.fixtureFirstPicks(options)
  const player = game.getWaiting()[0].actor
  card = game._adjustCardParam(card)
  game.rk.undo('Player Turn')

  TestUtil.setColor(game, player, card.color, [card])
  return game
}

TestUtil.fixtureFirstPicks = function(options) {
  const game = TestUtil.fixture(options)
  game.run()
  game.rk.undo('Initialization Complete')

  // Save the team ordering
  const teams = game.getPlayerAll().map(player => player.team)

  // Put the players into the expected seating order.
  const sortedPlayers = [...game.state.players]
  sortedPlayers.sort((l, r) => l._id - r._id)
  game.rk.replace(game.state.players, sortedPlayers)

  // Readjust teams
  for (let i = 0; i < sortedPlayers.length; i++) {
    game.rk.put(game.getPlayerByIndex(i), 'team', teams[i])
  }

  TestUtil.setHand(game, 'dennis', ['Archery', 'Tools'])
  TestUtil.setHand(game, 'micah', ['Domestication', 'Writing'])
  TestUtil.setHand(game, 'tom', ['Sailing', 'Code of Laws'])
  TestUtil.setHand(game, 'eliya', ['Masonry', 'City States'])
  game.run()

  game.submit({
    actor: 'dennis',
    name: 'Choose Initial Card',
    option: ['Tools'],
  })
  game.submit({
    actor: 'micah',
    name: 'Choose Initial Card',
    option: ['Domestication'],
  })

  if (game.testOptions.numPlayers >= 3) {
    game.submit({
      actor: 'tom',
      name: 'Choose Initial Card',
      option: ['Sailing'],
    })
  }
  if (game.testOptions.numPlayers >= 4) {
    game.submit({
      actor: 'eliya',
      name: 'Choose Initial Card',
      option: ['Masonry'],
    })
  }

  return game
}

TestUtil.getOptionKind = function(game, optionKind) {
  const waiting = game.getWaiting()[0]
  return waiting.options.find(o => o.kind === optionKind)
}

TestUtil.getAchievement = function(game, actor, achievement) {
  const sourceZone = game.getZoneByCard(achievement)
  const targetZone = game.getAchievements(actor)
  game.mMoveCard(sourceZone, targetZone, achievement)
}

TestUtil.decree = function(game, decree) {
  const waiting = game.getWaiting()[0]
  game.submit({
    actor: waiting.actor,
    name: waiting.name,
    option: [{
      name: 'Decree',
      option: [decree]
    }]
  })
}

TestUtil.dogma = function(game, cardName) {
  const waiting = game.getWaiting()[0]
  game.submit({
    actor: waiting.actor,
    name: waiting.name,
    option: [{
      name: 'Dogma',
      option: [cardName]
    }]
  })
}

TestUtil.inspire = function(game, color) {
  const waiting = game.getWaiting()[0]
  game.submit({
    actor: waiting.actor,
    name: waiting.name,
    option: [{
      name: 'Inspire',
      option: [color]
    }]
  })
}

TestUtil.meld = function(game, cardName) {
  const waiting = game.getWaiting()[0]
  game.submit({
    actor: waiting.actor,
    name: waiting.name,
    option: [{
      name: 'Meld',
      option: [cardName]
    }]
  })
}

TestUtil.setArtifact = function(game, player, card) {
  // This lets fixtures call this for all players regardless of the number of players in
  // the game, so that they don't have to be constantly checking the number of players
  // during setup. Players that don't exist just won't do anything.
  let zone
  try {
    zone = game.getZoneArtifact(player)
  }
  catch (e) {
    return
  }

  // Get rid of existing artifact
  game.mReturnAll(player, zone)

  // Fetch the desired artifact.
  const cardZone = game.getZoneByCard(card)
  game.mMoveCard(cardZone, zone, card)
}

TestUtil.setHand = function(game, player, cards) {
  // This lets fixtures call this for all players regardless of the number of players in
  // the game, so that they don't have to be constantly checking the number of players
  // during setup. Players that don't exist just won't do anything.
  let hand
  try {
    hand = game.getHand(player)
  }
  catch {
    return
  }

  for (let i = hand.cards.length - 1; i >= 0; i--) {
    game.mReturn(player, hand.cards[i])
  }

  for (const card of cards) {
    const zone = game.getZoneByCard(card)
    game.mMoveCard(zone, hand, card)
  }
}

TestUtil.setColor = function(game, player, color, cards) {
  const zone = game.getZoneColorByPlayer(player, color)
  game.mReturnAll(player, zone)
  for (const card of cards) {
    const source = game.getZoneByCard(card)
    game.mMoveCard(source, zone, card)
  }
}

TestUtil.topDeck = function(game, exp, age, cards) {
  cards = [...cards].reverse()
  const deck = game.getDeck(exp, age)
  for (const card of cards) {
    game.mMoveByIndices(
      deck,
      deck.cards.indexOf(card),
      deck,
      0
    )
  }
}

TestUtil.dumpLog = function(game) {
  const output = []
  for (const entry of game.state.log) {
    output.push(log.toString(entry))
  }
  console.log(output.join('\n'))
}

TestUtil.dumpStack = function(game) {
  TestUtil.deepLog(game.state.sm.stack)
}

function _dumpZonesRecursive(root) {
  const output = []

  if (root.name) {
    output.push(root.name)
    for (const card of root.cards) {
      if (typeof card === 'string') {
        output.push(`   ${card}`)
      }
      else {
        output.push(`   ${card.id}, ${card.name}`)
      }
    }
  }

  else {
    for (const zone of Object.values(root)) {
      output.push(_dumpZonesRecursive(zone))
    }
  }

  return output.join('\n')
}

TestUtil.dumpZones = function(game, root) {
  console.log(_dumpZonesRecursive(root || game.state.zones))
}



module.exports = TestUtil
