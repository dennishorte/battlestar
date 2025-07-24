module.exports = {
  name: `Combustion`,
  color: `red`,
  age: 7,
  expansion: `base`,
  biscuits: `ccfh`,
  dogmaBiscuit: `c`,
  dogma: [
    `I demand you transfer one card from your score pile to my score pile for every top card with {c} on my board!`,
    `Return your bottom red card.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const count = game
        .getTopCards(leader)
        .filter(c => c.checkHasBiscuit('c'))
        .length

      if (count === 0) {
        game.log.add({ template: 'No {c} in top cards' })
        return
      }

      const choices = game.zones.byPlayer(player, 'score').cardlist()
      const target = game.zones.byPlayer(leader, 'score')
      game.actions.chooseAndTransfer(player, choices, target, { count })
    },

    (game, player) => {
      const red = game.zones.byPlayer(player, 'red').cardlist()
      if (red.length === 0) {
        game.log.addNoEffect()
      }
      else {
        game.actions.return(player, red[red.length - 1])
      }
    }
  ],
}
