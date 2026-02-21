module.exports = {
  id: "wood-expert-d117",
  name: "Wood Expert",
  deck: "occupationD",
  number: 117,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you immediately get 2 wood. Each improvement costs you up to 2 wood less, if you pay 1 food instead.",
  allowsFoodForWoodSubstitution: true,
  maxWoodSubstitution: 2,
  onPlay(game, player) {
    player.addResource('wood', 2)
    game.log.add({
      template: '{player} gets 2 wood from {card}',
      args: { player , card: this},
    })
  },
}
