'use strict'

const constants = require('../../../constants.js')

module.exports = {
  id: "southern-elders",
  name: "Southern Elders",
  source: "Uprising",
  compatibility: "All",
  count: 1,
  persuasionCost: 4,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [],
  factionAccess: [
    "bene-gesserit",
    "fremen"
  ],
  spyAccess: false,
  agentAbility: "If you have another Bene Gesserit card in play:\n· +2 Troops",
  revealPersuasion: 0,
  revealSwords: 0,
  revealAbility: "· +1 Water\nFremen Bond:\n· +2 Persuasion",
  factionAffiliation: ["bene-gesserit", "fremen"],
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

  revealEffect(game, player, card, allRevealedCards) {
    player.incrementCounter('water', 1, { silent: true })
    game.log.add({ template: '{player}: +1 Water', args: { player } })
    const hasFremen = allRevealedCards.some(c =>
      c !== card && constants.getFactionAffiliations(c).includes('fremen')
    )
    if (hasFremen) {
      player.incrementCounter('persuasion', 2, { silent: true })
      game.log.add({ template: '{player}: Fremen Bond — +2 Persuasion', args: { player } })
    }
  },

  previewReveal(game, player, handCards) {
    const self = handCards.find(c => c.defId === 'southern-elders')
    const others = handCards.filter(c => c !== self)
    const playedCards = game.zones.byId(`${player.name}.played`).cardlist()
    const hasFremen = [...others, ...playedCards].some(c =>
      constants.getFactionAffiliations(c).includes('fremen')
    )
    return {
      water: 1,
      persuasion: hasFremen ? 2 : 0,
    }
  },


  agentEffects: [
    {
      type: 'conditional',
      condition: {
        type: 'faction-card-in-play',
        faction: 'bene-gesserit'
      },
      effects: [
        {
          type: 'troop',
          amount: 2
        }
      ]
    }
  ],
}
