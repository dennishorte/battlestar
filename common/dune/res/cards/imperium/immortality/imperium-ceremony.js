'use strict'

module.exports = {
  id: "imperium-ceremony",
  name: "Imperium Ceremony",
  source: "Immortality",
  compatibility: "All",
  count: 1,
  persuasionCost: 6,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "green"
  ],
  factionAccess: [
    "emperor",
    "guild"
  ],
  spyAccess: false,
  agentAbility: "Look at the top two cards of the Intrigue deck\n· Keep one and put the other back on top",
  revealPersuasion: 3,
  revealSwords: 0,
  revealAbility: null,
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
    // Look at the top two cards of the Intrigue deck. Keep one and put the other back on top.
    const intrigueDeck = game.zones.byId('common.intrigueDeck')
    const topCards = intrigueDeck.cardlist().slice(0, 2)
    if (topCards.length >= 2) {
      const choices = topCards.map(c => c.name)
      const [choice] = game.actions.choose(player, choices, {
        title: 'Keep which Intrigue card?',
      })
      const kept = topCards.find(c => c.name === choice)
      const returned = topCards.find(c => c.name !== choice)
      if (kept) {
        const playerIntrigue = game.zones.byId(`${player.name}.intrigue`)
        kept.moveTo(playerIntrigue)
      }
      if (returned) {
        // Already on top of deck, no need to move
      }
      game.log.add({
        template: '{player} looks at top 2 Intrigue cards, keeps 1',
        args: { player },
      })
    }
    else if (topCards.length === 1) {
      const playerIntrigue = game.zones.byId(`${player.name}.intrigue`)
      topCards[0].moveTo(playerIntrigue)
    }
  },

}
