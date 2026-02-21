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
      const selection = game.actions.choose(player, ['2 wood', '2 clay', '1 reed', '1 stone'], {
        title: 'Tax Collector: Choose resource',
        min: 1,
        max: 1,
      })
      const choice = selection[0]
      if (choice === '2 wood') {
        player.addResource('wood', 2)
      }
      else if (choice === '2 clay') {
        player.addResource('clay', 2)
      }
      else if (choice === '1 reed') {
        player.addResource('reed', 1)
      }
      else if (choice === '1 stone') {
        player.addResource('stone', 1)
      }
      game.log.add({
        template: '{player} gets {choice} from {card}',
        args: { player, choice , card: this},
      })
    }
  },
}
