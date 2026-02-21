module.exports = {
  id: "lettuce-patch-c070",
  name: "Lettuce Patch",
  deck: "minorC",
  number: 70,
  type: "minor",
  cost: {},
  vps: 1,
  prereqs: { occupations: 3 },
  category: "Crop Provider",
  text: "This card is a field that can only grow vegetables. You can immediately turn each vegetable you harvested from this card into 4 food.",
  isField: true,
  providesVegetableField: true,
  onPlay(game, player) {
    player.addVirtualField({
      cardId: 'lettuce-patch-c070',
      label: 'Lettuce Patch',
      cropRestriction: 'vegetables',
      onHarvest: true,
    })
    game.log.add({
      template: '{player} plays {card}, gaining a vegetable-only field',
      args: { player , card: this},
    })
  },
  onHarvest(game, player, amount) {
    if (amount > 0) {
      const selection = game.actions.choose(player, [
        `Convert ${amount} vegetable to ${amount * 4} food`,
        'Keep vegetables',
      ], { title: 'Lettuce Patch', min: 1, max: 1 })
      if (selection[0] !== 'Keep vegetables') {
        player.addResource('vegetables', -amount)
        player.addResource('food', amount * 4)
        game.log.add({
          template: '{player} converts {amount} vegetable to {food} food via {card}',
          args: { player, amount, food: amount * 4 , card: this},
        })
      }
    }
  },
}
