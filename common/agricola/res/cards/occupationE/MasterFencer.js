module.exports = {
  id: "master-fencer-e088",
  name: "Master Fencer",
  deck: "occupationE",
  number: 88,
  type: "occupation",
  players: "1+",
  text: "Once you live in a stone house, at the start of each round, you can pay 2 or 3 wood to build up to 3 or 4 fences, respectively.",
  onRoundStart(game, player) {
    if (player.roomType === 'stone' && player.wood >= 2) {
      game.actions.offerMasterFencerBuild(player, this)
    }
  },
}
