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

  // Agent ability: immediately acquire one card to your hand, paying with
  // Solari instead of Persuasion. This resolves inline during the Agent Turn
  // (the card text overrides the normal Reveal-Turn acquisition rule); it
  // does NOT carry over to the player's Reveal Turn.
  agentEffect(game, player, card, { acquireCard }) {
    acquireCard(game, player, { useSolari: true, toHand: true })
  },

  onAcquire(game, player, card, { resolveEffect }) {
    resolveEffect(game, player, { type: 'gain', resource: 'solari', amount: 2 }, null, card.name)
  },


  revealEffects: [
    {
      type: 'gain',
      resource: 'solari',
      amount: 2
    }
  ],
}
