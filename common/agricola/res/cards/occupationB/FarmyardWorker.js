module.exports = {
  id: "farmyard-worker-b140",
  name: "Farmyard Worker",
  deck: "occupationB",
  number: 140,
  type: "occupation",
  players: "3+",
  text: "At the end of each work phase in which you placed at least 1 good on 1 of your farmyard spaces, you get 2 food.",
  onBuildRoom(_game, player) {
    player._fwPlaced = true
  },
  onPlowField(_game, player) {
    player._fwPlaced = true
  },
  onSow(_game, player) {
    player._fwPlaced = true
  },
  onBuildPasture(_game, player) {
    player._fwPlaced = true
  },
  onBuildStable(_game, player) {
    player._fwPlaced = true
  },
  onWorkPhaseEnd(game, player) {
    if (player._fwPlaced) {
      player.addResource('food', 2)
      game.log.add({
        template: '{player} gets 2 food',
        args: { player },
      })
    }
    delete player._fwPlaced
  },
}
