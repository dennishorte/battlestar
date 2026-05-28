'use strict'

const factions = require('../../../../systems/factions.js')
const constants = require('../../../constants.js')
module.exports = {
  id: "firm-grip",
  name: "Firm Grip",
  source: "Base",
  compatibility: "All",
  count: 1,
  persuasionCost: 4,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "green"
  ],
  factionAccess: [
    "emperor"
  ],
  spyAccess: false,
  agentAbility: "Pay 2 Solari:\n· +1 Influence with Spacing Guild\n  OR\n· +1 Influence with Bene Gesserit\n  OR\n· +1 Influence with Fremen",
  revealPersuasion: 0,
  revealSwords: 0,
  revealAbility: "Having Emperor Alliance: +4 Persuation",
  factionAffiliation: "emperor",
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
    // Pay 2 Solari: +1 Influence with: Spacing Guild OR Bene Gesserit OR Fremen
    if (player.solari >= 2) {
      const factionChoices = ['Pass', 'Spacing Guild', 'Bene Gesserit', 'Fremen']
      const [choice] = game.actions.choose(player, factionChoices, {
        title: 'Firm Grip: Pay 2 Solari for +1 Influence? (choose faction)',
      })
      if (choice !== 'Pass') {
        player.decrementCounter('solari', 2, { silent: true })
        factions.gainInfluence(game, player, constants.normalizeFactionId(choice))
      }
    }
  },


  revealEffects: [
    {
      type: 'conditional',
      condition: {
        type: 'has-specific-alliance',
        faction: 'emperor'
      },
      effects: [
        {
          type: 'gain',
          resource: 'persuasion',
          amount: 4
        }
      ]
    }
  ],
}
