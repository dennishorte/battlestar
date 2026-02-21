module.exports = {
  id: "braid-maker-e109",
  name: "Braid Maker",
  deck: "occupationE",
  number: 109,
  type: "occupation",
  players: "1+",
  text: "Each harvest, you can use this card to exchange 1 reed for 2 food. You can build the Basketmaker's Workshop for 1 reed and 1 stone even when taking a \"Minor Impr.\" action.",
  allowsMajorOnMinorAction: true,
  allowedMajors: ["basketmakers-workshop"],
  onHarvest(game, player) {
    if (player.reed >= 1) {
      const selection = game.actions.choose(player, ['Convert 1 reed to 2 food', 'Skip'], {
        title: 'Braid Maker: Convert?',
        min: 1,
        max: 1,
      })
      if (selection[0] !== 'Skip') {
        player.removeResource('reed', 1)
        player.addResource('food', 2)
        game.log.add({
          template: '{player} converts 1 reed to 2 food using {card}',
          args: { player , card: this},
        })
      }
    }
  },
  modifyMajorCost(player, majorId, cost) {
    if (majorId === 'basketmakers-workshop') {
      return { reed: 1, stone: 1 }
    }
    return cost
  },
}
