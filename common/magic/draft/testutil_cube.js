const { CubeDraftFactory } = require('./cube_draft.js')
const TestCommon = require('../../lib/test_common.js')

const TestUtil = { ...TestCommon }
module.exports = TestUtil


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
    packSize: 3,
    packs: [
      {
        owner: 'dennis',
        id: 'dennis-0',
        testIndex: 0,
        cards: [
          'advance scout',
          'agility',
          'akki ember-keeper',
          'white knight',
          'shock',
        ],
      },
      {
        owner: 'dennis',
        id: 'dennis-1',
        testIndex: 1,
        cards: [
          'benalish hero',
          'goblin balloon brigade',
          'holy strength',
          'agility',
          'mountain',
        ],
      },
      {
        owner: 'dennis',
        testIndex: 2,
        id: 'dennis-2',
        cards: [
          'advance scout',
          'agility',
          'akki ember-keeper',
          'plains',
          'advance scout',
        ],
      },
      {
        owner: 'micah',
        testIndex: 0,
        id: 'micah-0',
        cards: [
          'lightning bolt',
          'mountain',
          'plains',
          'tithe',
          'goblin balloon brigade',
        ],
      },
      {
        owner: 'micah',
        testIndex: 1,
        id: 'micah-1',
        cards: [
          'shock',
          'tithe',
          'white knight',
          'mountain',
          'advance scout',
        ],
      },
      {
        owner: 'micah',
        testIndex: 2,
        id: 'micah-2',
        cards: [
          'benalish hero',
          'advance scout',
          'lightning bolt',
          'tithe',
          'shock',
        ],
      },
      {
        owner: 'scott',
        testIndex: 0,
        id: 'scott-0',
        cards: [
          'lightning bolt',
          'mountain',
          'plains',
          'tithe',
          'goblin balloon brigade',
        ],
      },
      {
        owner: 'scott',
        testIndex: 1,
        id: 'scott-1',
        cards: [
          'shock',
          'tithe',
          'white knight',
          'mountain',
          'advance scout',
        ],
      },
      {
        owner: 'scott',
        testIndex: 2,
        id: 'scott-2',
        cards: [
          'benalish hero',
          'advance scout',
          'lightning bolt',
          'tithe',
          'shock',
        ],
      },
    ],
  }, options)

  options.players = options.players.slice(0, options.numPlayers)
  options.packs = options
    .packs
    .filter(p => p.testIndex < options.numPacks)
    .map(p => p.cards)
    .map(p => p.slice(0, options.packSize))

  const game = CubeDraftFactory(options, 'dennis')

  game.testSetBreakpoint('initialization-complete', (game) => {
    // Set turn order
    game.state.players = ['dennis', 'micah', 'scott', 'eliya']
      .slice(0, game.settings.numPlayers)
      .map(name => game.getPlayerByName(name))
      .filter(p => p !== undefined)
  })

  return game
}

TestUtil.choose = function(game, request, actor, option) {
  const selector = request.selectors.find(s => s.actor === actor)

  return game.respondToInputRequest({
    actor: selector.actor,
    title: selector.title,
    selection: [option],
   })
}

TestUtil.testBoard = function(game, expected) {
  for (const player of game.getPlayerAll()) {
    this.testPicks(game, player.name, expected[player.name].picked)
    this.testWaitingPacks(game, player.name, expected[player.name].waiting)
    this.testNextRoundPacks(game, player.name, expected[player.name].nextRound || [])
  }
}

TestUtil.testPicks = function(game, playerName, cardNames) {
  const player = game.getPlayerByName(playerName)
  const picks = game.getPicksByPlayer(player).map(c => c.name)
  expect(picks).toStrictEqual(cardNames)
}

TestUtil.testWaitingPacks = function(game, playerName, packIds) {
  const player = game.getPlayerByName(playerName)
  const waiting = game.getWaitingPacksForPlayer(player).map(p => p.id)
  expect(packIds).toStrictEqual(waiting)
}

TestUtil.testNextRoundPacks = function(game, playerName, packIds) {
  const player = game.getPlayerByName(playerName)
  const waiting = player.nextRoundPacks.map(p => p.id)
  expect(packIds).toStrictEqual(waiting)
}

TestUtil.testVisibility = function(game, playerName, expected) {
  const player = game.getPlayerByName(playerName)
  const pack = game.getNextPackForPlayer(player)

  const visibleCards = pack.getKnownCards(player).map(c => c.name).sort()
  expect(visibleCards).toStrictEqual(expected.visible.sort())

  const picked = pack.getKnownPickedCards(player).map(c => c.name).sort()
  expect(picked).toStrictEqual(expected.picked.sort())

  const yourPicks = pack.getPlayerPicks(player).map(c => c.name).sort()
  expect(yourPicks).toStrictEqual(expected.yourPicks.sort())
}
