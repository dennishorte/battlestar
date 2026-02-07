module.exports = {
  id: "stable-sergeant-b167",
  name: "Stable Sergeant",
  deck: "occupationB",
  number: 167,
  type: "occupation",
  players: "4+",
  text: "When you play this card, you can pay 2 food to get 1 sheep, 1 wild boar, and 1 cattle, but only if you can accommodate all three animals on your farm.",
  onPlay(game, player) {
    if (player.food >= 2 &&
          player.canPlaceAnimals('sheep', 1) &&
          player.canPlaceAnimals('boar', 1) &&
          player.canPlaceAnimals('cattle', 1)) {
      game.actions.offerStableSergeantAnimals(player, this)
    }
  },
}
