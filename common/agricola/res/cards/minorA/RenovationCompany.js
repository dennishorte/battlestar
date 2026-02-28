module.exports = {
  id: "renovation-company-a013",
  name: "Renovation Company",
  deck: "minorA",
  number: 13,
  type: "minor",
  cost: { wood: 4 },
  prereqs: { roomCount: 2, roomCountExact: true, houseType: "wood" },
  category: "Farm Planner",
  text: "When you play this card, you immediately get 3 clay. Immediately after, you can renovate without paying any building resources.",
  onPlay(game, player) {
    player.addResource('clay', 3)
    game.log.add({
      template: '{player} gets 3 clay from {card}',
      args: { player, card: this },
    })

    game.actions.freeRenovation(player, { card: this, canSkip: true })
  },
}
