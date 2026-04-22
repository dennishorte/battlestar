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

  plotEffect(game, player) {
    // Give an opponent an Intrigue card -> +1 Spice (or +2 if non-Twisted)
    const intrigueZone = game.zones.byId(`${player.name}.intrigue`)
    const cards = intrigueZone.cardlist()
    if (cards.length > 0) {
      const cardChoices = cards.map(c => c.name)
      const [cardChoice] = game.actions.choose(player, cardChoices, { title: 'Give which Intrigue card?' })
      const card = cards.find(c => c.name === cardChoice)
      const opponents = game.players.all().filter(p => p.name !== player.name)
      const [opponentName] = game.actions.choose(player, opponents.map(p => p.name), { title: 'Give to which opponent?' })
      const oppIntrigue = game.zones.byId(`${opponentName}.intrigue`)
      card.moveTo(oppIntrigue)
      player.incrementCounter('spice', 1, { silent: true })
      game.log.add({ template: '{player}: Gives Intrigue to {opponent}, +1 Spice', args: { player, opponent: opponentName } })
    }
  },

}
