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
    const playedZone = game.zones.byId(`${player.name}.played`)
    const hasOtherBG = playedZone.cardlist().some(c =>
      c !== card && constants.getFactionAffiliations(c).includes('bene-gesserit')
    )
    if (hasOtherBG) {
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
    const choices = ['Pass', 'Recall 2 Spies for +3 Persuasion']
    const [choice] = game.actions.choose(player, choices, { title: 'In High Places' })
    if (choice === 'Pass') {
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

  onAcquire(game, player, card, { resolveEffect }) {
    resolveEffect(game, player, { type: 'spy' }, null, card.name)
  },
}
