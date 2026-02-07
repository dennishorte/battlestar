module.exports = {
  id: "motivator-e093",
  name: "Motivator",
  deck: "occupationE",
  number: 93,
  type: "occupation",
  players: "1+",
  text: "On your first turn each round, if you have no unused farmyard spaces, you can place a person from your supply.",
  onTurnStart(game, player) {
    if (player.isFirstTurnOfRound() && player.getUnusedFarmyardSpaces() === 0 && player.hasPersonInSupply()) {
      game.actions.offerPlacePersonFromSupply(player, this)
    }
  },
}
