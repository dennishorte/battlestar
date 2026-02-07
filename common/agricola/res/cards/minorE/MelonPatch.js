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
      template: '{player} plays Melon Patch, gaining a vegetable-only field',
      args: { player },
    })
  },
  onHarvestLast(game, player) {
    game.actions.offerFreePlow(player, this)
  },
}
