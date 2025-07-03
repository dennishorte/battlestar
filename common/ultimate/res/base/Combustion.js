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

      const choices = game.getZoneByPlayer(player, 'score').cards()
      const target = game.getZoneByPlayer(leader, 'score')
      game.aChooseAndTransfer(player, choices, target, { count })
    },

    (game, player) => {
      const red = game.getZoneByPlayer(player, 'red').cards()
      if (red.length === 0) {
        game.log.addNoEffect()
      }
      else {
        game.aReturn(player, red[red.length - 1])
      }
    }
  ],
}
