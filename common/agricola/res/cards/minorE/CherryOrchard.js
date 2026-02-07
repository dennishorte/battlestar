module.exports = {
  id: "cherry-orchard-e068",
  name: "Cherry Orchard",
  deck: "minorE",
  number: 68,
  type: "minor",
  cost: {},
  text: "This card is a field on which you can only sow and harvest wood as you would grain. Each time you harvest the last wood from this card, you also get 1 vegetable.",
  isField: true,
  fieldCrop: "wood",
  onPlay(game, player) {
    player.addVirtualField({
      cardId: 'cherry-orchard-e068',
      label: 'Cherry Orchard',
      cropRestriction: 'wood',
      onHarvestLast: true,
    })
    game.log.add({
      template: '{player} plays Cherry Orchard, gaining a wood-only field',
      args: { player },
    })
  },
  onHarvestLast(game, player) {
    player.addResource('vegetables', 1)
    game.log.add({
      template: '{player} gets 1 vegetable from Cherry Orchard',
      args: { player },
    })
  },
}
