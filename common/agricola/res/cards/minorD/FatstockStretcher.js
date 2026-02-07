module.exports = {
  id: "fatstock-stretcher-d056",
  name: "Fatstock Stretcher",
  deck: "minorD",
  number: 56,
  type: "minor",
  cost: { wood: 1 },
  category: "Food Provider",
  text: "Each time you turn a sheep or wild boar into food using a cooking improvement, you get 1 additional food.",
  onCookAnimal(game, player, animalType) {
    if (animalType === 'sheep' || animalType === 'boar') {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Fatstock Stretcher',
        args: { player },
      })
    }
  },
}
