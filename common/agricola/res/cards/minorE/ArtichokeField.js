module.exports = {
  id: "artichoke-field-e072",
  name: "Artichoke Field",
  deck: "minorE",
  number: 72,
  type: "minor",
  cost: { wood: 1 },
  vps: 1,
  prereqs: { occupations: 2 },
  text: "This card is a field. During the field phase of each harvest, if you harvest at least 1 good from this card, you also get 1 food.",
  isField: true,
  onPlay(game, player) {
    player.addVirtualField({
      cardId: 'artichoke-field-e072',
      label: 'Artichoke Field',
      cropRestriction: null,  // Can grow any crop
      onHarvest: true,
    })
    game.log.add({
      template: '{player} plays Artichoke Field',
      args: { player },
    })
  },
  onHarvest(game, player, amountHarvested) {
    if (amountHarvested > 0) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Artichoke Field',
        args: { player },
      })
    }
  },
}
