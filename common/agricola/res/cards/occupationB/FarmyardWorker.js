module.exports = {
  id: "farmyard-worker-b140",
  name: "Farmyard Worker",
  deck: "occupationB",
  number: 140,
  type: "occupation",
  players: "3+",
  text: "At the end of each work phase in which you placed at least 1 good on 1 of your farmyard spaces, you get 2 food.",
  onWorkPhaseEnd(game, player) {
    if (player.placedGoodOnFarmyardThisPhase) {
      player.addResource('food', 2)
      game.log.add({
        template: '{player} gets 2 food from Farmyard Worker',
        args: { player },
      })
    }
  },
}
