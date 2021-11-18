const bsg = require('../game.js')
const util = require('../../lib/util.js')
const transitions = require('../transitions.js')


module.exports = GameFixtureFactory

function GameFixtureFactory(options) {
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

  this.options = Object.assign({
    crisis: 'Ambush',
    crisisResult: 'fail',
    destiny: null,  // If an array, sets the destiny deck to the listed cards
    players: [
      {
        character: 'Gaius Baltar',
        startingSkills: ['leadership', 'politics', 'engineering'],
        hand: null,
        movement: 'Skip Movement',
        action: 'Skip Action',
      },
      {
        character: 'Kara "Starbuck" Thrace',
        startingSkills: ['tactics', 'piloting', {
          name: 'Optional Skills 1',
          option: ['leadership'],
        }],
        hand: null,
        movement: 'Skip Movement',
        action: 'Skip Action',
      },
      {
        character: 'Sharon "Boomer" Valerii',
        startingSkills: ['tactics', 'piloting', 'engineering'],
        hand: null,
        movement: 'Skip Movement',
        action: 'Skip Action',
      },
    ],
  }, options)

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

GameFixtureFactory.prototype._setDestinyDeck = function(cardInfo) {
  const game = this.game
  const destinyZone = game.getZoneByName('destiny')
  this._setSkillCardsInZone(destinyZone, cardInfo)
}

GameFixtureFactory.prototype._setPlayerHand = function(player, hand) {
  const game = this.game
  const handZone = game.getZoneByPlayer(player)
  this._setSkillCardsInZone(handZone, hand)
}


GameFixtureFactory.prototype._setSkillCardsInZone = function(zone, cardInfo) {
  const game = this.game

  game.rk.sessionStart(() => {

    // Return the existing cards in the specified zone
    for (let i = zone.cards.length - 1; i >= 0; i--) {
      const card = zone.cards[i]
      if (card.kind !== 'skill') continue
      const skillZone = game.getZoneBySkill(card.skill)
      game.mMoveCard(zone, skillZone, card)
    }

    // Move the desired cards into the zone
    for (const desc of cardInfo) {
      if (desc.kind === 'skill') {
        const cardZone = game.getZoneBySkill(desc.skill)
        const card = cardZone.cards.find(c => c.name === desc.name && c.value === desc.value)
        game.mMoveCard(cardZone, zone, card)
      }
      else {
        throw new Error(`Unhandled card kind: ${desc.kind}`)
      }
    }

  })
}

GameFixtureFactory.prototype.advanceTo = function(targetTransitionName, targetPlayerName) {
  this.game.run()

  ////////////////////
  // Deck Setup

  // Crisis Deck
  const crisisCardIndex = this.game.state.zones.decks.crisis.cards.findIndex(c => c.name === this.options.crisis)
  this.game.rk.sessionStart(() => {
    this.game.mMoveByIndices('decks.crisis', crisisCardIndex, 'decks.crisis', 0)
  })

  // Destiny Deck
  if (Array.isArray(this.options.destiny)) {
    this._setDestinyDeck(this.options.destiny)
  }


  ////////////////////
  // Players Submit

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

  // If there are specific cards in hand specified, load them here
  for (let i in this.options.players) {
    const playerOptions = this.options.players[i]
    const player = this.game.getPlayerByIndex(i)
    if (Array.isArray(playerOptions.hand)) {
      this._setPlayerHand(player, playerOptions.hand)
    }
  }

  // Skip movement
  this.game.submit({
    actor: 'dennis',
    name: 'Movement',
    option: [this.options.players[0].movement],
  })
  if (this._checkForTarget(targetTransitionName, targetPlayerName)) {
    return this
  }

  // Skip action
  this.game.submit({
    actor: 'dennis',
    name: 'Action',
    option: [this.options.players[0].action],
  })
  if (this._checkForTarget(targetTransitionName, targetPlayerName)) {
    return this
  }

  const crisis = this.game.getCrisis()
  if (crisis.type.includes('Skill Check')) {

    // Skill Check - Discuss
    this.game.submit({
      actor: 'dennis',
      name: 'Skill Check - Discuss',
      option: [
        {
          name: 'How much can you help?',
          option: ['a little'],
        },
        {
          name: 'Start Skill Check',
          option: ['yes'],
        },
      ]
    })
    if (this._checkForTarget(targetTransitionName, targetPlayerName)) {
      return this
    }

    // Skill Check - Add Cards
    for (const name of ['micah', 'tom', 'dennis']) {
      this.game.submit({
        actor: name,
        name: 'Skill Check - Add Cards',
        option: ['Do Nothing']
      })
      if (this._checkForTarget(targetTransitionName, targetPlayerName)) {
        return this
      }
    }
  }

  else if (crisis.type === 'Choice') {
    throw new Error('not implemented')
  }

  else if (crisis.type === 'Cylon Attack') {
    throw new Error('not implemented')
  }

  else {
    throw new Error(`Unhandled crisis type: ${crisis.type}`)
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
