module.exports = {
  id: "layabout-c108",
  name: "Layabout",
  deck: "occupationC",
  number: 108,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you must skip the next harvest. (You also do not have to feed your family that harvest.)",
  onPlay(game, player) {
    player.skipNextHarvest = true
    game.log.add({
      template: '{player} will skip the next harvest from {card}',
      args: { player , card: this},
    })
  },
}
