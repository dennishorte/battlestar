module.exports = {
  name: `Stamp Act`,
  color: `yellow`,
  age: 6,
  expansion: `arti`,
  biscuits: `hcss`,
  dogmaBiscuit: `s`,
  dogma: [
    `I compel you to transfer a card of value equal to the top yellow card on your board from your score pile to mine! If you do, return a card from your score pile of value equal to the top green card on your board!`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const topYellow = game.getTopCard(player, 'yellow')
      if (topYellow) {
        const choices = game
          .getCardsByZone(player, 'score')
          .filter(card => card.getAge() === topYellow.getAge())
        const transferred =
          game.actions.chooseAndTransfer(player, choices, game.zones.byPlayer(leader, 'score'))

        if (transferred && transferred.length > 0) {
          const topGreen = game.getTopCard(player, 'green')
          if (topGreen) {
            const greenChoices = game
              .getCardsByZone(player, 'score')
              .filter(card => card.getAge() === topGreen.getAge())
            game.actions.chooseAndReturn(player, greenChoices)
          }
        }
        else {
          game.log.add({ template: 'No card was transferred' })
        }
      }
    }
  ],
}
