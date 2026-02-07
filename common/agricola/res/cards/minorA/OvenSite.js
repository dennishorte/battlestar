module.exports = {
  id: "oven-site-a027",
  name: "Oven Site",
  deck: "minorA",
  number: 27,
  type: "minor",
  cost: {},
  prereqs: { hasFireplaceAndCookingHearth: true },
  category: "Building Resource Provider",
  text: "When you play this card, you get 2 wood and you can immediately build the \"Clay Oven\" or \"Stone Oven\" major improvement. Either way, it only costs you 1 clay and 1 stone.",
  onPlay(game, player) {
    player.addResource('wood', 2)
    game.log.add({
      template: '{player} gets 2 wood from Oven Site',
      args: { player },
    })
    game.actions.offerDiscountedOven(player, this, { clay: 1, stone: 1 })
  },
}
