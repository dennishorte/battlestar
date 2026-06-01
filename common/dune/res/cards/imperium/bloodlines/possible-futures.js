'use strict'

const factions = require('../../../../systems/factions.js')
const constants = require('../../../constants.js')
module.exports = {
  id: "possible-futures",
  name: "Possible Futures",
  source: "Bloodlines",
  compatibility: "All",
  count: 1,
  persuasionCost: 8,
  acquisitionBonus: "+1 Water",
  passiveAbility: null,
  agentIcons: [
    "green",
    "purple",
    "yellow"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "· +1 Influence with any Faction\n  OR\n· +2 Troops\nIf you have another Bene Gesserit card in play, get both",
  revealPersuasion: 2,
  revealSwords: 0,
  revealAbility: "+1 Water",
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
    // +1 Influence with any Faction OR +2 Troops. If you have another BG card in play, get both.
    const pickFaction = () => {
      const fc = constants.FACTIONS.map(f => game.actions.option({ id: f, title: f, kind: 'faction' }))
      const [fChoice] = game.actions.choose(player, fc, {
        title: 'Choose faction for +1 Influence',
      })
      return typeof fChoice === 'object' ? fChoice.id : fChoice
    }
    if (constants.hasOtherFactionAffiliatedCardInPlay(game, player, card, 'bene-gesserit')) {
      // Get both
      const faction = pickFaction()
      factions.gainInfluence(game, player, faction)
      const recruit = Math.min(2, player.troopsInSupply)
      if (recruit > 0) {
        player.decrementCounter('troopsInSupply', recruit, { silent: true })
        player.incrementCounter('troopsInGarrison', recruit, { silent: true })
        game.log.add({ template: '{player} recruits {count} troop(s)', args: { player, count: recruit } })
      }
    }
    else {
      const choices = [
        game.actions.option({ id: 'influence', title: '+1 Influence with any Faction' }),
        game.actions.option({ id: 'troops', title: '+2 Troops' }),
      ]
      const [choice] = game.actions.choose(player, choices, { title: 'Choose one' })
      const chId = typeof choice === 'object' ? choice.id : choice
      const isInfluence = chId === 'influence' || (typeof choice === 'string' && choice.includes('Influence'))
      if (isInfluence) {
        const faction = pickFaction()
        factions.gainInfluence(game, player, faction)
      }
      else {
        const recruit = Math.min(2, player.troopsInSupply)
        if (recruit > 0) {
          player.decrementCounter('troopsInSupply', recruit, { silent: true })
          player.incrementCounter('troopsInGarrison', recruit, { silent: true })
          game.log.add({ template: '{player} recruits {count} troop(s)', args: { player, count: recruit } })
        }
      }
    }
  },

  onAcquire(game, player, card, { resolveEffect }) {
    resolveEffect(game, player, { type: 'gain', resource: 'water', amount: 1 }, null, card.name)
  },


  revealEffects: [
    {
      type: 'gain',
      resource: 'water',
      amount: 1
    }
  ],
}
