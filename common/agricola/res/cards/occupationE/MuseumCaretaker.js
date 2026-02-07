module.exports = {
  id: "museum-caretaker-e100",
  name: "Museum Caretaker",
  deck: "occupationE",
  number: 100,
  type: "occupation",
  players: "1+",
  text: "At the start of each work phase, if you have at least 1 wood, 1 clay, 1 reed, 1 stone, 1 grain, and 1 vegetable in your supply, you get 1 bonus point.",
  onWorkPhaseStart(game, player) {
    if (player.wood >= 1 && player.clay >= 1 && player.reed >= 1 &&
          player.stone >= 1 && player.grain >= 1 && player.vegetables >= 1) {
      player.bonusPoints = (player.bonusPoints || 0) + 1
      game.log.add({
        template: '{player} gets 1 bonus point from Museum Caretaker',
        args: { player },
      })
    }
  },
}
