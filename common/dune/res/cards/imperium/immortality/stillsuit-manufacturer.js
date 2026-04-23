'use strict'

module.exports = {
  id: "stillsuit-manufacturer",
  name: "Stillsuit Manufacturer",
  source: "Immortality",
  compatibility: "All",
  count: 1,
  persuasionCost: 5,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "purple"
  ],
  factionAccess: [
    "fremen"
  ],
  spyAccess: false,
  agentAbility: "· +1 Water\nIf you have the Fremen Alliance:\n· Return this card from play to your hand",
  revealPersuasion: 1,
  revealSwords: 0,
  revealAbility: "Fremen Bond: +2 Spice",
  factionAffiliation: "fremen",
  vpsAvailable: 0,
  hasTech: false,
  hasShipping: false,
  hasUnload: false,
  hasInfiltration: false,
  hasResearch: false,
  hasGrafting: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,

  agentEffect(game, player, card) {
    // +1 Water AND If you have the Fremen Alliance: Return this card from play to hand.
    player.incrementCounter('water', 1, { silent: true })
    game.log.add({ template: '{player} gains 1 Water', args: { player } })
    if (game.state.alliances.fremen === player.name) {
      const handZone = game.zones.byId(`${player.name}.hand`)
      card.moveTo(handZone)
      game.log.add({ template: '{player} returns {card} to hand (Fremen Alliance)', args: { player, card } })
    }
  },

}
