'use strict'

module.exports = {
  id: "weirding-woman",
  name: "Weirding Woman",
  source: "Uprising",
  compatibility: "All",
  count: 2,
  persuasionCost: 1,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "purple",
    "yellow"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "If you have another Bene Gesserit card in play:\n· Return this card from play to your hand",
  revealPersuasion: 1,
  revealSwords: 1,
  revealAbility: null,
  factionAffiliation: "bene-gesserit",
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
    // If you have another BG card in play, return this card from play to your hand
    const playedZone = game.zones.byId(`${player.name}.played`)
    const hasBG = playedZone.cardlist().some(c =>
      c !== card && c.factionAffiliation && c.factionAffiliation.toLowerCase().includes('bene gesserit')
    )
    if (hasBG) {
      const handZone = game.zones.byId(`${player.name}.hand`)
      card.moveTo(handZone)
      game.log.add({
        template: '{player} returns {card} to hand (Bene Gesserit synergy)',
        args: { player, card: card.name },
      })
    }
  },

}
