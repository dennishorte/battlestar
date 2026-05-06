'use strict'

module.exports = {
  id: "price-is-not-object",
  name: "Price is Not Object",
  source: "Uprising",
  compatibility: "All",
  count: 1,
  persuasionCost: 6,
  acquisitionBonus: "+2 Solari",
  passiveAbility: null,
  agentIcons: [],
  factionAccess: [
    "emperor",
    "bene-gesserit"
  ],
  spyAccess: false,
  agentAbility: "You may acquire a card to your hand using Solari instead of Persuasion",
  revealPersuasion: 2,
  revealSwords: 0,
  revealAbility: "+2 Solari",
  factionAffiliation: ["emperor", "bene-gesserit"],
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
    if (game.state.turnTracking) {
      game.state.turnTracking.acquireWithSolari = true
      game.state.turnTracking.acquireToHand = true
    }
    // Persist across the Agent → Reveal turn boundary (turnTracking is
    // reset at the start of every turn, including the player's own Reveal
    // Turn where acquireCardsPhase actually consumes these flags).
    game.state.persistentFlags = game.state.persistentFlags || {}
    const flags = game.state.persistentFlags[player.name] || {}
    flags.acquireWithSolari = true
    flags.acquireToHand = true
    game.state.persistentFlags[player.name] = flags
  },

  onAcquire(game, player, card, { resolveEffect }) {
    resolveEffect(game, player, { type: 'gain', resource: 'solari', amount: 2 }, null, card.name)
  },

}
