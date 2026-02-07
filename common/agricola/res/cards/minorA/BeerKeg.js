module.exports = {
  id: "beer-keg-a062",
  name: "Beer Keg",
  deck: "minorA",
  number: 62,
  type: "minor",
  cost: { wood: 1 },
  prereqs: { grain: 2 },
  category: "Food Provider",
  text: "In the feeding phase of each harvest, you can use this card to exchange 1/2/3 grain for 0/1/2 bonus points and exactly 3 food.",
  onFeedingPhase(game, player) {
    if (player.grain >= 1) {
      game.actions.offerBeerKeg(player, this)
    }
  },
}
