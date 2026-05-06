'use strict'

const constants = require('../../constants.js')
const { addStrength } = require('../../../systems/strengthBreakdown.js')
const deckEngine = require('../../../systems/deckEngine.js')

module.exports = {
  id: "impress",
  name: "Impress",
  source: "Uprising",
  compatibility: "All",
  count: 1,
  hasTech: false,
  hasShipping: false,
  hasResearch: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,
  isTwisted: false,
  vpsAvailable: 0,
  plotEffect: null,
  endgameEffect: null,
  combatText: "+2 Swords and Acquire a card that costs 3 Persuasion or less",

  combatEffect(game, player) {
    addStrength(game, player, 'intrigue', 'Impress', 2 * constants.SWORD_STRENGTH)
    game.log.add({ template: '{player}: +2 Swords (Impress)', args: { player } })

    const rowZone = game.zones.byId('common.imperiumRow')
    const eligible = rowZone.cardlist().filter(c => (c.persuasionCost || 0) <= 3)
    if (eligible.length === 0) {
      return
    }

    const passSentinel = { name: 'Pass', id: '__pass__' }
    const [chosen] = game.actions.chooseCards(player, [passSentinel, ...eligible], {
      title: 'Impress: acquire a card costing 3 Persuasion or less',
      kind: 'imperium-card',
    })
    if (!chosen || chosen.id === '__pass__') {
      return
    }
    deckEngine.acquireCard(game, player, chosen)
    deckEngine.refillImperiumRow(game)
    game.log.add({ template: '{player} acquires {card} (Impress, free)', args: { player, card: chosen } })
  },

}
