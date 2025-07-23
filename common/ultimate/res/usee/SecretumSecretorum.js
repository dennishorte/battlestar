module.exports = {
  name: `Secretum Secretorum`,
  color: `blue`,
  age: 3,
  expansion: `usee`,
  biscuits: `shsc`,
  dogmaBiscuit: `s`,
  dogma: [
    `Return five cards from your hand and/or score pile. Draw two cards of value equal to the number of different colors of cards you return. Meld one of the drawn cards and score the other.`
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = [
        ...game.zones.byPlayer(player, 'hand').cards(),
        ...game.zones.byPlayer(player, 'score').cards()
      ]

      const returned = game.actions.chooseAndReturn(player, choices, {
        count: 5,
        title: 'Choose 5 cards to return'
      })

      const numColors = new Set(returned.map(card => card.color)).size
      const drawnCards = []

      for (let i = 0; i < 2; i++) {
        const card = game.aDraw(player, { age: numColors })
        if (card) {
          drawnCards.push(card)
        }
      }

      if (drawnCards.length > 0) {
        const melded = game.actions.chooseAndMeld(player, drawnCards, { count: 1 })[0]
        const toScore = drawnCards.find(card => card !== melded)
        if (toScore) {
          game.actions.score(player, toScore)
        }
      }
    },
  ],
}
