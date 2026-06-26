'use strict'

const deckEngine = require('../../../systems/deckEngine.js')

module.exports = {
  id: "inspire-awe",
  name: "Inspire Awe",
  source: "Uprising",
  compatibility: "All",
  count: 1,
  hasTech: false,
  hasShipping: false,
  hasResearch: false,
  hasSpies: false,
  hasSandworms: true,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,
  isTwisted: false,
  vpsAvailable: 0,
  combatEffect: null,
  endgameEffect: null,
  plotText: "Acquire a card that costs 3 Persuasion or less; if you have one or more Sandworms in the Conflict, put that card in your hand",

  plotEffect(game, player) {
    const rowZone = game.zones.byId('common.imperiumRow')
    const eligible = rowZone.cardlist().filter(c => (c.persuasionCost || 0) <= 3)
    if (eligible.length === 0) {
      return
    }

    const passSentinel = { name: 'Pass', id: '__pass__' }
    const [chosen] = game.actions.chooseCards(player, [passSentinel, ...eligible], {
      title: 'Inspire Awe: acquire a card costing 3 Persuasion or less',
      kind: 'imperium-card',
    })
    if (!chosen || chosen.id === '__pass__') {
      return
    }

    const sandworms = game.state.conflict?.deployedSandworms?.[player.name] || 0
    if (sandworms > 0) {
      const handZone = game.zones.byId(`${player.name}.hand`)
      chosen.moveTo(handZone)
      deckEngine.refillImperiumRow(game)
      game.log.add({ template: '{player} acquires {card} to hand (Inspire Awe)', args: { player, card: chosen } })
    }
    else {
      deckEngine.acquireCard(game, player, chosen)
      game.log.add({ template: '{player} acquires {card} (Inspire Awe)', args: { player, card: chosen } })
    }
  },

}
