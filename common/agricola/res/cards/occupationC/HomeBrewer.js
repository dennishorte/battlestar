module.exports = {
  id: "home-brewer-c110",
  name: "Home Brewer",
  deck: "occupationC",
  number: 110,
  type: "occupation",
  players: "1+",
  text: "After the field phase of each harvest, you can use this card to turn exactly 1 grain into your choice of 3 food or 1 bonus point.",
  onFieldPhaseEnd(game, player) {
    if (player.grain >= 1) {
      game.actions.offerHomeBrewerConversion(player, this)
    }
  },
}
