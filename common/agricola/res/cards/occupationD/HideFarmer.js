module.exports = {
  id: "hide-farmer-d132",
  name: "Hide Farmer",
  deck: "occupationD",
  number: 132,
  type: "occupation",
  players: "1+",
  text: "During scoring, you can pay 1 food each for any number of unused farmyard spaces. You do not lose points for these spaces.",
  onScoring(game, player) {
    game.actions.offerHideFarmerPayment(player, this)
  },
}
