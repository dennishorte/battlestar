module.exports = {
  id: "land-heir-e119",
  name: "Land Heir",
  deck: "occupationE",
  number: 119,
  type: "occupation",
  players: "1+",
  text: "If you play this card in round 4 or before, place 4 wood and 4 clay on the space for round 9. At the start of this round, you get the resources.",
  onPlay(game, player) {
    if (game.state.round <= 4) {
      game.scheduleResource(player, 'wood', 9, 4)
      game.scheduleResource(player, 'clay', 9, 4)

      game.log.add({
        template: '{player} schedules 4 wood and 4 clay for round 9 from {card}',
        args: { player , card: this},
      })
    }
  },
}
