const bsg = require('../game.js')
const util = require('../../lib/util.js')
const transitions = require('../transitions.js')


module.exports = GameFixtureFactory

function GameFixtureFactory() {
  this.phases = {
    FIRST_RUN: 0,
    POST_CHARACTER_SELECTION: 1,
    POST_SETUP: 2,
  }

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
      },
      {
        character: 'Kara "Starbuck" Thrace',
        startingSkills: ['leadership', 'tactics', 'piloting'],
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
      option: this.options.players[i].character
    })
  }

  // Do skill-selection
  for (let i = 1; i < this.game.getPlayerAll().length; i++) {
    const player = this.game.getPlayerByIndex(i)
    this.game.submit({
      actor: player.name,
      name: 'Select Starting Skills',
      option: this.options.players[i].startingSkills
    })
  }

  // this.game.dumpHistory()
  this.game.dumpLog()

  if (!targetTransitionName) {
    return this
  }

  // Backup until there is a hit on the matcher
  while (true) {
    const recentHistory = this.game.state.history.slice(-1)[0]
    const transitionPush = recentHistory.find(diff => {
      return diff.path === '.sm.stack' && diff.old.length === 0
    })

    if (transitionPush) {
      if (recentHistory.length !== 2) {
        for (const diff of recentHistory) {
          console.log(diff)
        }
        throw new Error("Transition change sessions should always contain a log and a stack update.")
      }

      const { name, data } = transitionPush.new[0]
      if (name === targetTransitionName) {
        if (targetPlayerName) {
          if (data.playerName === targetPlayerName) {
            break
          }
        }
        else {
          break
        }
      }
    }

    this.game.rk.undo()
  }

  this.game.dumpLog()

  return this
}

GameFixtureFactory.prototype.advance = function(phase) {
  if (!phase) {
    phase = this.phases.FIRST_RUN
  }

  if (this.phase < this.phases.FIRST_RUN && phase >= this.phases.FIRST_RUN) {
    this.phase = this.phases.FIRST_RUN
    this.game.run()
  }

  if (this.phase < this.phases.POST_CHARACTER_SELECTION
      && phase >= this.phases.POST_CHARACTER_SELECTION) {

    this.phase = this.phases.POST_CHARACTER_SELECTION
    for (let i = 0; i < this.game.getPlayerAll().length; i++) {
      const player = this.game.getPlayerByIndex(i)
      this.game.submit({
        actor: player.name,
        name: 'Select Character',
        option: this.options.players[i].character
      })
    }
  }

  if (this.phase < this.phases.POST_SETUP
      && phase >= this.phases.POST_SETUP) {

    this.phase = this.phases.POST_SETUP
    for (let i = 1; i < this.game.getPlayerAll().length; i++) {
      const player = this.game.getPlayerByIndex(i)
      this.game.submit({
        actor: player.name,
        name: 'Select Starting Skills',
        option: this.options.players[i].startingSkills
      })
    }
  }

  return this
}
