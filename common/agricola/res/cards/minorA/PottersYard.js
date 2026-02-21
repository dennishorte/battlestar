module.exports = {
  id: "potters-yard-a040",
  name: "Potter's Yard",
  deck: "minorA",
  number: 40,
  type: "minor",
  cost: { wood: 1, reed: 1 },
  prereqs: { unusedFarmyardAtMost: 7 },
  category: "Building Resource Provider",
  text: "Immediately place 1 clay on each unused space in your farmyard. Each time you turn a space into a used space, you get the clay and you can immediately exchange it for 2 food.",
  onPlay(game, player) {
    const unused = player.getUnusedSpaceCount()
    if (unused > 0) {
      player.pottersYardClay = unused
      game.log.add({
        template: '{player} places {amount} clay on unused farmyard spaces',
        args: { player, amount: unused },
      })
    }
  },
  onUseSpace(game, player) {
    if (player.pottersYardClay > 0) {
      player.pottersYardClay--
      player.addResource('clay', 1)
      game.log.add({
        template: '{player} gets 1 clay from {card}',
        args: { player, card: this },
      })
      const card = this
      const choices = [
        'Exchange 1 clay for 2 food',
        'Skip',
      ]
      const selection = game.actions.choose(player, choices, {
        title: `${card.name}: Exchange clay for food?`,
        min: 1,
        max: 1,
      })

      if (selection[0] !== 'Skip') {
        player.payCost({ clay: 1 })
        player.addResource('food', 2)
        game.log.add({
          template: '{player} exchanges 1 clay for 2 food using {card}',
          args: { player, card },
        })
      }
    }
  },
}
