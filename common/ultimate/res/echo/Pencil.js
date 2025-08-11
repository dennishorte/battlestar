module.exports = {
  name: `Pencil`,
  color: `yellow`,
  age: 4,
  expansion: `echo`,
  biscuits: `h&s4`,
  dogmaBiscuit: `s`,
  echo: `Draw a {5}.`,
  dogma: [
    `You may return up to three cards from your hand. If you do, draw that many cards of value one higher than the highest card you returned. Return all but one of them, and foreshadow the remaining card.`,
  ],
  dogmaImpl: [
    (game, player) => {
      const returned = game.aChooseAndReturn(player, game.cards.byPlayer(player, 'hand'), {
        min: 0,
        max: 3
      })

      if (returned && returned.length > 0) {
        const age = game.utilHighestCards(returned)[0].getAge()
        const drawn = []
        for (let i = 0; i < returned.length; i++) {
          const card = game.aDraw(player, { age: age + 1 })
          if (card) {
            drawn.push(card)
          }
        }

        const card = game.aChooseCard(player, drawn, { title: 'Choose a card to foreshadow' })
        game.actions.foreshadow(player, card)
        game.aReturnMany(player, drawn.filter(other => other !== card))
      }
    }
  ],
  echoImpl: (game, player) => {
    game.aDraw(player, { age: game.getEffectAge(this, 5) })
  },
}
