module.exports = {
  id: "muddy-puddles-b083",
  name: "Muddy Puddles",
  deck: "minorB",
  number: 83,
  type: "minor",
  cost: { clay: 2 },
  category: "Livestock Provider",
  text: "Pile (from bottom to top) 1 wild boar, 1 food, 1 cattle, 1 food, and 1 sheep on this card. At any time, you can pay 1 clay to take the top good.",
  allowsAnytimePurchase: true,
  muddyPuddlesPurchase: true,
  onPlay(game, player) {
    player.muddyPuddlesStack = ['boar', 'food', 'cattle', 'food', 'sheep']
    game.log.add({
      template: '{player} places goods on Muddy Puddles',
      args: { player },
    })
  },
}
