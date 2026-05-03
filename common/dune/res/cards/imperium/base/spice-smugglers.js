'use strict'

const factions = require('../../../../systems/factions.js')
const leaderAbilities = require('../../../../systems/leaderAbilities.js')

module.exports = {
  id: "spice-smugglers",
  name: "Spice Smugglers",
  source: "Base",
  compatibility: "All",
  count: 2,
  persuasionCost: 2,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "purple"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "Pay 2 Spice:\n· +1 Spacing Guild Influence\n· +3 Solari",
  revealPersuasion: 1,
  revealSwords: 1,
  revealAbility: null,
  factionAffiliation: "guild",
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
    if (player.spice < 2) {
      return
    }
    const [choice] = game.actions.choose(player, ['Pay 2 Spice', 'Pass'], {
      title: 'Spice Smugglers: Pay 2 Spice for +1 Spacing Guild Influence and +3 Solari?',
    })
    if (choice === 'Pass') {
      return
    }
    player.decrementCounter('spice', 2, { silent: true })
    game.log.add({
      template: '{player} pays {amount} {resource}',
      args: { player, amount: 2, resource: 'spice' },
    })
    factions.gainInfluence(game, player, 'guild')
    player.incrementCounter('solari', 3, { silent: true })
    game.log.add({
      template: '{player} gains {amount} {resource}',
      args: { player, amount: 3, resource: 'solari' },
    })
    leaderAbilities.onGainSolari(game, player, 3)
  },
}
