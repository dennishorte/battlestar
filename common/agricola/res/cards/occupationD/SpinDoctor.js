module.exports = {
  id: "spin-doctor-d151",
  name: "Spin Doctor",
  deck: "occupationD",
  number: 151,
  type: "occupation",
  players: "1+",
  text: "Immediately after each time you use the \"Traveling Players\" accumulation space, you can place another person on an action space of your choice, regardless whether or not the action space is occupied.",
  onAction(game, player, actionId) {
    if (actionId === 'traveling-players' && player.hasAvailableWorker()) {
      game.actions.offerSpinDoctorPlacement(player, this)
    }
  },
}
