const { transitionFactory2 } = require('../../lib/transitionFactory.js')
const util = require('../../lib/util.js')
const res = require('../resources.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'first',
      func: _first,
    },
    {
      name: 'initializePlayers',
      func: _initializePlayers,
    },
    {
      name: 'initializeTeams',
      func: _initializeTeams,
    },
    {
      name: 'initializeZones',
      func: _initializeZones,
    },
    {
      name: 'dealStartingCards',
      func: _dealStartingCards
    },
    {
      name: 'initializationComplete',
      func: _initializationComplete,
    },
  ]
})

function _first(context) {
  const game = context.state
  const logId = game.mLog({
    template: 'Initializing'
  })
  game.rk.addKey(context.data, 'parentLogIndent', 0)
}

function _initializePlayers(context) {
  const game = context.state
  game.state.players = game.state.users.map(user => ({
    _id: user._id,
    name: user.name,
    team: user.name,
  }))
  util.array.shuffle(game.state.players)
  game.state.players.forEach((player, index) => {
    player.index = index
  })
  game.mResetDogmaInfo()
  game.mResetMonumentCounts()
}

function _initializeTeams(context) {
  const game = context.state
  const teams = game.state.options.teams
  const players = game.getPlayerAll()

  let teamMod = players.length
  if (teams) {
    util.assert(game.getPlayerAll().length === 4, 'Teams only supported with 4 players')
    teamMod = 2
  }

  for (let i = 0; i < players.length; i++) {
    const teamNumber = i % teamMod
    game.rk.addKey(players[i], 'team', `team${teamNumber}`)
  }
}

function _initializeZones(context) {
  const game = context.state
  const zones = game.state.zones

  _addDeckZones(zones)
  _addAchievementZones(game, zones)
  _addPlayerZones(game.state.players, zones)
}

function _addDeckZones(zones) {
  zones.decks = {}
  for (const exp of ['base', 'echo', 'figs', 'city', 'arti']) {
    zones.decks[exp] = {}
    const data = res[exp]
    for (const [age, cards] of Object.entries(res[exp].byAge)) {
      if (!cards) {
        throw new Error(`Missing cards for ${exp}-${age}`)
      }
      else if (!Array.isArray(cards)) {
        throw new Error(`Cards for ${exp}-${age} is of type ${typeof cards}`)
      }
      const deckCards = cards.map(c => c.name)
      util.array.shuffle(deckCards)
      zones.decks[exp][age] = {
        name: `decks.${exp}.${age}`,
        cards: deckCards,
        kind: 'deck',
      }
    }
  }
}

function _addAchievementZones(game, zones) {
  zones.achievements = {
    name: 'achievements',
    cards: [],
    kind: 'public',
  }

  // Standard achievements
  for (const age of [1,2,3,4,5,6,7,8,9]) {
    game.mMoveCard(game.getDeck('base', age), game.getZoneByName('achievements'))
  }

  // Special achievements
  for (const exp of ['base', 'echo', 'figs', 'city', 'arti']) {
    if (game.getExpansionList().includes(exp)) {
      for (const ach of res[exp].achievements) {
        zones.achievements.cards.push(ach.id)
      }
    }
  }
}

function _addPlayerZones(players, zones) {
  zones.players = {}
  for (const player of players) {
    const root = {}
    _addPlayerZone(player, 'hand', 'private', root)
    _addPlayerZone(player, 'score', 'private', root)
    _addPlayerZone(player, 'forecast', 'private', root)
    _addPlayerZone(player, 'achievements', 'public', root)
    _addPlayerZone(player, 'red', 'public', root)
    _addPlayerZone(player, 'blue', 'public', root)
    _addPlayerZone(player, 'green', 'public', root)
    _addPlayerZone(player, 'yellow', 'public', root)
    _addPlayerZone(player, 'purple', 'public', root)
    _addPlayerZone(player, 'artifact', 'public', root)
    zones.players[player.name] = root

    for (const color of ['red', 'yellow', 'green', 'blue', 'purple']) {
      root[color].splay = 'none'
    }
  }
}

function _addPlayerZone(player, name, kind, root) {
  root[name] = {
    name: `players.${player.name}.${name}`,
    cards: [],
    kind,
  }

  if (kind === 'private') {
    root[name].owner = player.name
  }
}

function _dealStartingCards(context) {
  const game = context.state
  for (const player of game.getPlayerAll()) {
    game.mDraw(player, 'base', 1)

    if (game.getExpansionList().includes('echo')) {
      game.mDraw(player, 'echo', 1)
    }
    else {
      game.mDraw(player, 'base', 1)
    }
  }
}

function _initializationComplete(context) {
  const game = context.state
  game.state.initialized = true
  game.mLog({ template: 'Initialization Complete' })
  game.rk.checkpoint('Initialization Complete')
}
