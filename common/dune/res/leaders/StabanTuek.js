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
      template: '{player}: Smuggle Spice — +{amount} {resource} (spying on {space})',
      args: { player, amount: 1, resource: 'spice', space: space.name },
    })
  },

  resolveSignetRing(game, player, _resolveEffectFn) {
    const spies = require('../../systems/spies.js')
    const boardSpaces = require('../boardSpaces.js')
    const constants = require('../constants.js')

    const post = spies.placeSpy(game, player)
    if (!post) {
      return
    }

    // The post's connected spaces determine bonus eligibility.
    const connectedSpaces = post.spaces
      .map(id => boardSpaces.find(s => s.id === id))
      .filter(Boolean)
    const icons = new Set(connectedSpaces.map(s => s.icon))

    game.log.indent()
    if (icons.has('green') && player.spice >= 1) {
      const [tradeChoice] = game.actions.choose(player, [
        game.actions.option({ id: 'pass', title: 'Pass' }),
        game.actions.option({ id: 'trade', title: 'Trade 1 Spice → 3 Solari' }),
      ], {
        title: 'Unseen Network: Green bonus',
      })
      const tradeId = typeof tradeChoice === 'object' ? tradeChoice.id : tradeChoice
      if (tradeId !== 'pass' && tradeChoice !== 'Pass') {
        player.decrementCounter('spice', 1, { silent: true })
        player.incrementCounter('solari', 3, { silent: true })
        game.log.add({
          template: '{player}: Unseen Network — trades {amount} {resource} for {amount2} {resource2}',
          args: {
            player,
            amount: 1,
            resource: 'spice',
            amount2: 3,
            resource2: 'solari',
          },
        })
      }
    }
    const hasFactionSpace = connectedSpaces.some(s => constants.FACTIONS.includes(s.icon))
    if (hasFactionSpace && player.solari >= 2) {
      const [tradeChoice] = game.actions.choose(player, [
        game.actions.option({ id: 'pass', title: 'Pass' }),
        game.actions.option({ id: 'trade', title: 'Trade 2 Solari → 1 Intrigue' }),
      ], {
        title: 'Unseen Network: Faction bonus',
      })
      const tradeId = typeof tradeChoice === 'object' ? tradeChoice.id : tradeChoice
      if (tradeId !== 'pass' && tradeChoice !== 'Pass') {
        const deckEngine = require('../../systems/deckEngine.js')
        player.decrementCounter('solari', 2, { silent: true })
        deckEngine.drawIntrigueCard(game, player, 1)
        game.log.add({
          template: '{player}: Unseen Network — trades {amount} {resource} for 1 Intrigue',
          args: { player, amount: 2, resource: 'solari' },
        })
      }
    }
    game.log.outdent()
  },
}
