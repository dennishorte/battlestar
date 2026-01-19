export default {
  id: `Pele`,  // Card names are unique in Innovation
  name: `Pele`,
  color: `purple`,
  age: 9,
  expansion: `figs`,
  biscuits: `hapc`,
  dogmaBiscuit: `c`,
  karma: [
    `You may issue a Rivalry Decree with any two figures.`,
    `If you would score a card, first if both your top yellow card and your top green card are highest top cards on your board, you win.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Rivalry',
    },
    {
      trigger: 'score',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { self }) => {
        // Check that the player has a top green and a top yellow card.
        const topGreen = game.cards.top(player, 'green')
        const topYellow = game.cards.top(player, 'yellow')

        if (!topGreen || !topYellow) {
          game.log.add({
            template: '{player} does not have both a green and a yellow card',
            args: { player }
          })
          return
        }

        if (topGreen.getAge() !== topYellow.getAge()) {
          game.log.add({
            template: 'The top green and yellow cards are not the same age',
          })
          return
        }

        const topCards = game.cards.tops(player)
        const highestTopAge = game.util.highestCards(topCards)[0].getAge()

        if (highestTopAge === topGreen.getAge()) {
          game.youWin(player, self.name)
        }
        else {
          game.log.add({
            template: 'The top green and yellow cards are not the highest value',
          })
          return
        }
      }
    }
  ]
}
