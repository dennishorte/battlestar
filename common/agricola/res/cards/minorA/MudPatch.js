module.exports = {
  id: "mud-patch-a011",
  name: "Mud Patch",
  deck: "minorA",
  number: 11,
  type: "minor",
  cost: {},
  category: "Livestock Provider",
  text: "When you play this card, you immediately get 1 wild boar. You can hold 1 wild boar on each of your unplanted field tiles.",
  allowBoarOnFields: true,
  onPlay(game, player) {
    if (player.canPlaceAnimals('boar', 1)) {
      game.actions.handleAnimalPlacement(player, { boar: 1 })
      game.log.add({
        template: '{player} gets 1 wild boar from {card}',
        args: { player , card: this},
      })
    }
  },
}
