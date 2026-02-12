module.exports = {
  id: "feed-pellets-d084",
  name: "Feed Pellets",
  deck: "minorD",
  number: 84,
  type: "minor",
  cost: {},
  category: "Livestock Provider",
  text: "When you play this card, you immediately get 1 sheep. In the feeding phase of each harvest, you can exchange exactly 1 vegetable for 1 animal of a type you already have.",
  onPlay(game, player) {
    player.addAnimals('sheep', 1)
    game.log.add({
      template: '{player} gets 1 sheep from Feed Pellets',
      args: { player },
    })
  },
  onFeedingPhase(game, player) {
    if (player.vegetables >= 1 && player.hasAnyAnimals()) {
      game.actions.offerFeedPellets(player, this)
    }
  },
}
