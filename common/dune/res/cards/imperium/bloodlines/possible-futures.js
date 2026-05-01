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

  agentEffect(game, player) {
    // +1 Influence with any Faction OR +2 Troops. If you have another BG card in play, get both.
    const playedZone = game.zones.byId(`${player.name}.played`)
    const hasBG = playedZone.cardlist().some(c =>
      c.factionAffiliation && c.factionAffiliation.toLowerCase().includes('bene gesserit')
    )
    if (hasBG) {
      // Get both
      const [faction] = game.actions.choose(player, constants.FACTIONS, {
        title: 'Choose faction for +1 Influence',
      })
      factions.gainInfluence(game, player, faction)
      const recruit = Math.min(2, player.troopsInSupply)
      if (recruit > 0) {
        player.decrementCounter('troopsInSupply', recruit, { silent: true })
        player.incrementCounter('troopsInGarrison', recruit, { silent: true })
        game.log.add({ template: '{player} recruits {count} troop(s)', args: { player, count: recruit } })
      }
    }
    else {
      const choices = ['+1 Influence with any Faction', '+2 Troops']
      const [choice] = game.actions.choose(player, choices, { title: 'Choose one' })
      if (choice.includes('Influence')) {
        const [faction] = game.actions.choose(player, constants.FACTIONS, {
          title: 'Choose faction for +1 Influence',
        })
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

}
