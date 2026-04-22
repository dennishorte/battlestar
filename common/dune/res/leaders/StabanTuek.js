'use strict'

module.exports = {
  name: 'Staban Tuek',
  source: 'Uprising',
  compatibility: 'Uprising',
  house: null,
  startingEffect: 'Limited Allies\nYou start the game without Diplomacy in your deck.',
  leaderAbility: 'Smuggle Spice\nWhenever another player sends an Agent to a Maker board space you are spying on:\n· +1 Spice',
  signetRingAbility: 'Unseen Network\n· +1 Spy\nIf placed on Green:\n· Trade 1 Spice for 3 Solari\nIf placed on a Faction space:\n· Trade 2 Solari for 1 Intrigue card',
  complexity: 3,

  onAssign(game, player) {
    const deck = game.zones.byId(`${player.name}.deck`)
    const diplomacy = deck.cardlist().find(c => c.name === 'Diplomacy')
    if (diplomacy) {
      const trash = game.zones.byId('common.trash')
      diplomacy.moveTo(trash)
      game.log.add({
        template: '{player} starts without Diplomacy (Limited Allies)',
        args: { player },
      })
    }
  },

  modifyStartingDeck(_game, _player, names) {
    return names.filter(n => n !== 'Diplomacy')
  },

  onOpponentVisitsMakerSpace(game, opponent, space, player) {
    const spiesSystem = require('../../systems/spies.js')
    if (!spiesSystem.hasSpyAt(game, player, space.id)) {
      return
    }
    player.incrementCounter('spice', 1, { silent: true })
    game.log.add({
      template: '{player}: Smuggle Spice — +1 Spice (spying on {space})',
      args: { player, space: space.name },
    })
  },

  resolveSignetRing(game, player, _resolveEffectFn) {
    const spies = require('../../systems/spies.js')
    const observationPosts = require('../observationPosts.js')
    const boardSpaces = require('../boardSpaces.js')
    const constants = require('../constants.js')

    if (player.spiesInSupply <= 0) {
      return
    }

    const availablePosts = observationPosts.filter(post =>
      !(game.state.spyPosts[post.id] || []).includes(player.name)
    )
    if (availablePosts.length === 0) {
      return
    }

    const labels = availablePosts.map(post => {
      const spaceNames = post.spaces.map(id => {
        const space = boardSpaces.find(s => s.id === id)
        return space ? space.name : id
      })
      return `Post ${post.id} (${spaceNames.join(', ')})`
    })
    const [pick] = game.actions.choose(player, labels, {
      title: 'Unseen Network: Place Spy on which post?',
    })
    const post = availablePosts[labels.indexOf(pick)]
    spies.placeSpyAt(game, player, post.id)

    // The post's connected spaces determine bonus eligibility.
    const connectedSpaces = post.spaces
      .map(id => boardSpaces.find(s => s.id === id))
      .filter(Boolean)
    const icons = new Set(connectedSpaces.map(s => s.icon))

    game.log.indent()
    if (icons.has('green') && player.spice >= 1) {
      const [tradeChoice] = game.actions.choose(player, ['Pass', 'Trade 1 Spice → 3 Solari'], {
        title: 'Unseen Network: Green bonus',
      })
      if (tradeChoice !== 'Pass') {
        player.decrementCounter('spice', 1, { silent: true })
        player.incrementCounter('solari', 3, { silent: true })
        game.log.add({
          template: '{player}: Unseen Network — trades 1 Spice for 3 Solari',
          args: { player },
        })
      }
    }
    const hasFactionSpace = connectedSpaces.some(s => constants.FACTIONS.includes(s.icon))
    if (hasFactionSpace && player.solari >= 2) {
      const [tradeChoice] = game.actions.choose(player, ['Pass', 'Trade 2 Solari → 1 Intrigue'], {
        title: 'Unseen Network: Faction bonus',
      })
      if (tradeChoice !== 'Pass') {
        const deckEngine = require('../../systems/deckEngine.js')
        player.decrementCounter('solari', 2, { silent: true })
        deckEngine.drawIntrigueCard(game, player, 1)
        game.log.add({
          template: '{player}: Unseen Network — trades 2 Solari for 1 Intrigue',
          args: { player },
        })
      }
    }
    game.log.outdent()
  },
}
