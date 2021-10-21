const bsg = require('../game.js')
const util = require('../../lib/util.js')
const transitions = require('../transitions.js')


module.exports = GameFixtureFactory

function GameFixtureFactory() {
  this.lobby = {
    game: 'BattleStar Galactica',
    name: 'Test Lobby',
    options: {
      expansions: ['base game']
    },
    users: [
      { _id: 0, name: 'dennis' },
      { _id: 1, name: 'micah' },
      { _id: 2, name: 'tom' },
    ],
  }

  this.options = {
    players: [
      {
        character: 'Gaius Baltar',
        startingSkills: ['leadership', 'politics', 'engineering'],
      },
      {
        character: 'Kara "Starbuck" Thrace',
        startingSkills: ['tactics', 'piloting', {
          name: 'Option Skill',
          option: ['leadership'],
        }],
      },
      {
        character: 'Sharon "Boomer" Valerii',
        startingSkills: ['tactics', 'piloting', 'engineering'],
      },
    ],
  }

  this.phase = -1
  this.game = new bsg.Game()
}

GameFixtureFactory.prototype.build = function() {
  // Create a new game
  const state = bsg.factory(this.lobby)
  this.game.load(transitions, state, this.lobby.users[0])

  // Sort the players so they are consistent for testing
  this.game.state.players.sort((l, r) => l._id - r._id)

  return this
}

GameFixtureFactory.prototype.advanceTo = function(targetTransitionName, targetPlayerName) {
  this.game.run()

  // Do character-selection
  for (let i = 0; i < this.game.getPlayerAll().length; i++) {
    const player = this.game.getPlayerByIndex(i)
    this.game.submit({
      actor: player.name,
      name: 'Select Character',
      option: [this.options.players[i].character]
    })

    if (this._checkForTarget(targetTransitionName, targetPlayerName)) {
      return this
    }
  }

  // Do starting skill-selection
  for (let i = 1; i < this.game.getPlayerAll().length; i++) {
    const player = this.game.getPlayerByIndex(i)
    this.game.submit({
      actor: player.name,
      name: 'Select Starting Skills',
      option: this.options.players[i].startingSkills
    })

    if (this._checkForTarget(targetTransitionName, targetPlayerName)) {
      return this
    }
  }

  // Skip movement
  this.game.submit({
    actor: 'dennis',
    name: 'Movement',
    option: ['Skip Movement'],
  })
  if (this._checkForTarget(targetTransitionName, targetPlayerName)) {
    return this
  }

  return this
}

GameFixtureFactory.prototype._checkForTarget = function(targetTransitionName, targetPlayerName) {
  if (!targetTransitionName) {
    return false
  }

  let targetSession = null

  // Check if the desired transition/player combo exists in the history
  for (const session of this.game.state.history) {
    for (const diff of session) {
      if (diff.path === '.sm.stack'
          && diff.new.length
          && diff.new[0].name === targetTransitionName) {

        if (targetPlayerName) {
          if (diff.new[0].data.playerName && diff.new[0].data.playerName === targetPlayerName) {
            targetSession = session
            break
          }
        }
        else {
          targetSession = session
          break
        }
      }
    }

    if (targetSession) {
      break
    }
  }

  if (!targetSession) {
    return false
  }

  // console.log(`Target session found for ${targetTransitionName}, ${targetPlayerName}`)
  // console.log(targetSession)

  while (this.game.state.history[this.game.state.history.length - 1] !== targetSession) {
    this.game.rk.undo()
  }

  // this.game.dumpLog()
  return true
}
