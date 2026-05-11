'use strict'

module.exports = {
  id: "insidious",
  name: "Insidious",
  source: "Bloodlines",
  compatibility: "All",
  count: 1,
  hasTech: false,
  hasShipping: false,
  hasResearch: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,
  isTwisted: true,
  vpsAvailable: 0,
  combatEffect: null,
  endgameEffect: null,
  plotText: "Give an opponent an Intrigue card from your hand → +1 Spice. If you gave them a non-Twisted Intrigue card: +1 Spice",

  plotEffect(game, player) {
    // Give an opponent an Intrigue card -> +1 Spice (or +2 if non-Twisted)
    const intrigueZone = game.zones.byId(`${player.name}.intrigue`)
    const cards = intrigueZone.cardlist()
    if (cards.length > 0) {
      const card = game.actions.chooseCard(player, cards, { title: 'Give which Intrigue card?', kind: 'intrigue-card' })
      const opponents = game.players.all().filter(p => p.name !== player.name)
      const opponent = game.actions.choosePlayer(player, opponents, { title: 'Give to which opponent?' })
      const oppIntrigue = game.zones.byId(`${opponent.name}.intrigue`)
      card.moveTo(oppIntrigue)
      player.incrementCounter('spice', 1, { silent: true })
      game.log.add({ template: '{player}: Gives Intrigue to {opponent}, +1 Spice', args: { player, opponent } })
    }
  },

}
