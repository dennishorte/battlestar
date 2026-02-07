module.exports = {
  id: "bunny-breeder-e139",
  name: "Bunny Breeder",
  deck: "occupationE",
  number: 139,
  type: "occupation",
  players: "1+",
  text: "Select a future round space, subtract the number of the current round from it, and place this many food on that space. At the start of that round, you get the food.",
  onPlay(game, player) {
    game.actions.offerBunnyBreederChoice(player, this)
  },
}
