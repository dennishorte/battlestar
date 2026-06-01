'use strict'

module.exports = {
  id: "in-high-places",
  name: "In High Places",
  source: "Uprising",
  compatibility: "Uprising",
  count: 1,
  persuasionCost: 5,
  acquisitionBonus: "+1 Spy",
  passiveAbility: null,
  agentIcons: [],
  factionAccess: [
    "emperor",
    "bene-gesserit"
  ],
  spyAccess: false,
  agentAbility: "If you have another Bene Gesserit card in play:\n· Draw 1 card\n· +1 Spy",
  revealPersuasion: 2,
  revealSwords: 0,
  revealAbility: "Recall 2 Spies -> +3 Persuasion",
  factionAffiliation: ["emperor", "bene-gesserit"],
  vpsAvailable: 0,
  hasTech: false,
  hasShipping: false,
  hasUnload: false,
  hasInfiltration: false,
  hasResearch: false,
  hasGrafting: false,
  hasSpies: true,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,

  agentEffect(game, player, card, { resolveEffect }) {
    const constants = require('../../../constants.js')
    if (constants.hasOtherFactionAffiliatedCardInPlay(game, player, card, 'bene-gesserit')) {
      resolveEffect(game, player, { type: 'draw', amount: 1 }, null, card.name)
      resolveEffect(game, player, { type: 'spy' }, null, card.name)
    }
  },

  revealEffect(game, player) {
    const spyMod = require('../../../../systems/spies.js')
    const observationPosts = require('../../../observationPosts.js')
    let spiesOnBoard = 0
    for (const post of observationPosts) {
      const occupants = game.state.spyPosts[post.id] || []
      spiesOnBoard += occupants.filter(n => n === player.name).length
    }
    if (spiesOnBoard < 2) {
      return
    }
    const choices = [
      game.actions.option({ id: 'pass', title: 'Pass' }),
      game.actions.option({ id: 'recall', title: 'Recall 2 Spies for +3 Persuasion' }),
    ]
    const [choice] = game.actions.choose(player, choices, { title: 'In High Places' })
    const chId = typeof choice === 'object' ? choice.id : choice
    if (chId === 'pass' || choice === 'Pass') {
      return
    }
    spyMod.recallSpy(game, player)
    spyMod.recallSpy(game, player)
    if (game.state.turnTracking) {
      game.state.turnTracking.recalledSpy = true
    }
    player.incrementCounter('persuasion', 3, { silent: true })
    game.log.add({ template: '{player} gains 3 Persuasion', args: { player } })
  },

  previewReveal(game, player) {
    let count = 0
    for (const occupants of Object.values(game.state.spyPosts || {})) {
      for (const name of (occupants || [])) {
        if (name === player.name) {
          count++
        }
      }
    }
    return count >= 2
      ? { pending: 'Optional: recall 2 Spies → +3 Persuasion' }
      : {}
  },

  onAcquire(game, player, card, { resolveEffect }) {
    resolveEffect(game, player, { type: 'spy' }, null, card.name)
  },
}
