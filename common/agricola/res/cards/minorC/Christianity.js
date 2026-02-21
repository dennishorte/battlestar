module.exports = {
  id: "christianity-c038",
  name: "Christianity",
  deck: "minorC",
  number: 38,
  type: "minor",
  cost: {},
  vps: 2,
  prereqs: { sheepExactly: 1 },
  category: "Points Provider",
  text: "When you play this card, all other players get 1 food each.",
  onPlay(game, player) {
    for (const otherPlayer of game.players.all()) {
      if (otherPlayer.name !== player.name) {
        otherPlayer.addResource('food', 1)
        game.log.add({
          template: '{other} gets 1 food from {card}',
          args: { other: otherPlayer , card: this},
        })
      }
    }
  },
}
