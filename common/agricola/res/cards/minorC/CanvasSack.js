module.exports = {
  id: "canvas-sack-c040",
  name: "Canvas Sack",
  deck: "minorC",
  number: 40,
  type: "minor",
  cost: { grain: 1 },
  costAlternative: { reed: 1 },
  vps: 1,
  prereqs: { noOccupations: true },
  category: "Crop Provider",
  text: "When you play this card paying grain/reed for it, you immediately get 1 vegetable/4 wood.",
  onPlay(game, player, paidWith) {
    if (paidWith?.grain) {
      player.addResource('vegetables', 1)
      game.log.add({
        template: '{player} gets 1 vegetable from {card}',
        args: { player , card: this},
      })
    }
    else if (paidWith?.reed) {
      player.addResource('wood', 4)
      game.log.add({
        template: '{player} gets 4 wood from {card}',
        args: { player , card: this},
      })
    }
  },
}
