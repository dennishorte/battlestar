'use strict'

module.exports = {
  id: "weirding-way",
  name: "Weirding Way",
  source: "Rise of Ix",
  compatibility: "All",
  count: 1,
  persuasionCost: 3,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "purple",
    "yellow"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "You may take another turn immediately after this one",
  revealPersuasion: 1,
  revealSwords: 2,
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

  agentEffect(game, player) {
    const choices = [
      game.actions.option({ id: 'pass', title: 'Pass' }),
      game.actions.option({ id: 'extra', title: 'Take another turn' }),
    ]
    const [choice] = game.actions.choose(player, choices, { title: 'Weirding Way' })
    const choiceId = typeof choice === 'object' ? choice.id : choice
    if (choiceId === 'extra' && game.state.turnTracking) {
      game.state.turnTracking.extraTurn = true
    }
  },

}
