module.exports = {
  id: "midnight-fencer-e149",
  name: "Midnight Fencer",
  deck: "occupationE",
  number: 149,
  type: "occupation",
  players: "1+",
  text: "At the start of the last harvest, you can take up to 2 of each other player's unbuilt fences and build them on your farm at no cost. (Your farm can then have over 15 fences.)",
  onHarvestStart(game, player) {
    if (game.getHarvestNumber() === 6) {
      game.actions.offerMidnightFencerSteal(player, this)
    }
  },
}
