module.exports = {
  id: "open-air-farmer-b149",
  name: "Open Air Farmer",
  deck: "occupationB",
  number: 149,
  type: "occupation",
  players: "3+",
  text: "When you play this card, if you have at least 3 stables in your supply, remove 3 stables in your supply from play and build a pasture covering 2 farmyard spaces. You only need to pay a total of 2 wood for the fences.",
  onPlay(game, player) {
    if (player.stablesInSupply >= 3) {
      game.actions.offerOpenAirFarmerPasture(player, this)
    }
  },
}
