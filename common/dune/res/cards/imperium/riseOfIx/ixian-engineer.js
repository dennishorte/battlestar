'use strict'

module.exports = {
  id: "ixian-engineer",
  name: "Ixian Engineer",
  source: "Rise of Ix",
  compatibility: "Tech (Rise of Ix)",
  count: 2,
  persuasionCost: 5,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "yellow"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "Acquire Tech",
  revealPersuasion: 0,
  revealSwords: 0,
  revealAbility: "If you have three or more Tech tiles:\n· Trash this card → +1 Victory Point",
  factionAffiliation: null,
  vpsAvailable: 1,
  hasTech: true,
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

  agentEffects: [
    { type: 'acquire-tech' },
  ],

  revealEffect(game, player, card) {
    const owned = game.state.ownedTech?.[player.name] || []
    if (owned.length < 3) {
      return
    }
    const [choice] = game.actions.choose(player, [
      game.actions.option({ id: 'pass', title: 'Do not trash' }),
      game.actions.option({ id: 'trash', title: 'Trash this card for 1 Victory Point' }),
    ], { title: 'Ixian Engineer' })
    const choiceId = typeof choice === 'object' ? choice.id : choice
    if (choiceId !== 'trash' && choice !== 'Trash this card for 1 Victory Point') {
      return
    }
    require('../../../../systems/deckEngine.js').trashCard(game, card, player)
    player.incrementCounter('vp', 1, { silent: true, source: 'Ixian Engineer' })
  },
}
