module.exports = {
  id: "master-renovator-e087",
  name: "Master Renovator",
  deck: "occupationE",
  number: 87,
  type: "occupation",
  players: "1+",
  text: "At the end of the work phases of rounds 7 and 9, you can take a \"Renovation\" action without placing a person and pay 1 building resource of your choice less.",
  onWorkPhaseEnd(game, player) {
    if (game.state.round === 7 || game.state.round === 9) {
      game.actions.offerRenovationWithDiscount(player, this)
    }
  },
}
