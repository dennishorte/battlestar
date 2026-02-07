module.exports = {
  id: "tax-collector-e126",
  name: "Tax Collector",
  deck: "occupationE",
  number: 126,
  type: "occupation",
  players: "1+",
  text: "Once you live in a stone house, at the start of each round, you get your choice of 2 wood, 2 clay, 1 reed, or 1 stone.",
  onRoundStart(game, player) {
    if (player.roomType === 'stone') {
      game.actions.offerTaxCollectorChoice(player, this)
    }
  },
}
