module.exports = {
  id: "hayloft-barn-b021",
  name: "Hayloft Barn",
  deck: "minorB",
  number: 21,
  type: "minor",
  cost: { wood: 3 },
  prereqs: { occupations: 1 },
  category: "Food Provider",
  text: "Place 4 food on this card. Each time you obtain at least 1 grain, you also get 1 food from this card. Once it is empty, you get a \"Family Growth Even without Room\" action.",
  onPlay(game, player) {
    player.hayloftBarnFood = 4
    game.log.add({
      template: '{player} places 4 food on {card}',
      args: { player , card: this},
    })
  },
  onGainGrain(game, player) {
    if (player.hayloftBarnFood > 0) {
      player.hayloftBarnFood--
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from {card} ({remaining} remaining)',
        args: { player, remaining: player.hayloftBarnFood , card: this},
      })
      if (player.hayloftBarnFood === 0) {
        game.actions.familyGrowthWithoutRoom(player, { fromCard: true })
      }
    }
  },
}
