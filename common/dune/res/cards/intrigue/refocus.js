'use strict'

const deckEngine = require('../../../systems/deckEngine.js')
module.exports = {
  id: "refocus",
  name: "Refocus",
  source: "Base",
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
  combatEffect: null,
  endgameEffect: null,
  plotText: "Shuffle your discard pile into your deck, then: Draw 1 card",

  plotEffect(game, player) {
    const discardZone = game.zones.byId(`${player.name}.discard`)
    const deckZone = game.zones.byId(`${player.name}.deck`)
    for (const card of discardZone.cardlist()) {
      card.moveTo(deckZone)
    }
    deckZone.shuffle(game.random)
    deckEngine.drawCards(game, player, 1)
    game.log.add({ template: '{player}: Shuffles discard into deck, draws 1', args: { player } })
  },

}
