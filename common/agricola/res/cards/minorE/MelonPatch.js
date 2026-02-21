module.exports = {
  id: "melon-patch-e069",
  name: "Melon Patch",
  deck: "minorE",
  number: 69,
  type: "minor",
  cost: {},
  prereqs: { occupations: 2 },
  text: "This card is a field that can only grow vegetables. Each time you harvest the last vegetable from this card, you can plow 1 field.",
  isField: true,
  fieldCrop: "vegetables",
  onPlay(game, player) {
    player.addVirtualField({
      cardId: 'melon-patch-e069',
      label: 'Melon Patch',
      cropRestriction: 'vegetables',
      onHarvestLast: true,
    })
    game.log.add({
      template: '{player} plays {card}, gaining a vegetable-only field',
      args: { player , card: this},
    })
  },
  onHarvestLast(game, player) {
    const validSpaces = player.getValidPlowSpaces()
    if (validSpaces.length > 0) {
      const selection = game.actions.choose(player, [
        'Plow 1 field',
        'Skip',
      ], {
        title: 'Melon Patch',
        min: 1,
        max: 1,
      })
      if (selection[0] !== 'Skip') {
        game.actions.plowField(player)
        game.log.add({
          template: '{player} plows a field using {card}',
          args: { player, card: this },
        })
      }
    }
  },
}
