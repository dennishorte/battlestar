'use strict'

module.exports = {
  id: "local-fence",
  name: "Local Fence",
  source: "Rise of Ix",
  compatibility: "All",
  count: 1,
  persuasionCost: 3,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "purple"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "· Pay 2 Spice → +5 Solari\n  OR\n· Pay 5 Solari → +4 Spice",
  revealPersuasion: 2,
  revealSwords: 0,
  revealAbility: null,
  factionAffiliation: null,
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
    // Pay 2 Spice -> +5 Solari OR Pay 5 Solari -> +4 Spice
    const choices = []
    if (player.spice >= 2) {
      choices.push(game.actions.option({ id: 'spice-for-solari', title: 'Pay 2 Spice for 5 Solari' }))
    }
    if (player.solari >= 5) {
      choices.push(game.actions.option({ id: 'solari-for-spice', title: 'Pay 5 Solari for 4 Spice' }))
    }
    choices.push(game.actions.option({ id: 'pass', title: 'Pass' }))
    const [choice] = game.actions.choose(player, choices, { title: 'Local Fence' })
    const chId = typeof choice === 'object' ? choice.id : choice
    const isSpiceTrade = chId === 'spice-for-solari' || (typeof choice === 'string' && choice.includes('2 Spice'))
    const isSolariTrade = chId === 'solari-for-spice' || (typeof choice === 'string' && choice.includes('5 Solari'))
    if (isSpiceTrade) {
      player.decrementCounter('spice', 2, { silent: true })
      player.incrementCounter('solari', 5, { silent: true })
    }
    else if (isSolariTrade) {
      player.decrementCounter('solari', 5, { silent: true })
      player.incrementCounter('spice', 4, { silent: true })
    }
  },

}
