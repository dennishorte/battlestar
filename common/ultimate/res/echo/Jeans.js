module.exports = {
  name: `Jeans`,
  color: `green`,
  age: 7,
  expansion: `echo`,
  biscuits: `&lh8`,
  dogmaBiscuit: `l`,
  echo: [`Draw two {9}. Return one, foreshadow the other.`],
  dogma: [
    `Choose two different values less than {7}. Draw and reveal a card of each value. Meld one, and return the other.`
  ],
  dogmaImpl: [
    (game, player) => {
      const age1 = game.actions.chooseAge(player, [1,2,3,4,5,6], { title: 'Choose age to draw first' })
      const age2 = game.actions.chooseAge(
        player,
        [1,2,3,4,5,6].filter(x => x !== age1),
        { title: 'Choose age to draw second' }
      )
      const cards = [
        game.actions.drawAndReveal(player, age1),
        game.actions.drawAndReveal(player, age2),
      ]

      const melded = game.actions.chooseAndMeld(player, cards)
      if (melded && melded.length > 0) {
        cards.splice(cards.indexOf(melded[0]), 1)
      }

      if (cards.length > 0) {
        game.actions.return(player, cards[0])
      }
    }
  ],
  echoImpl: [
    (game, player) => {
      const cards = [
        game.actions.draw(player, { age: game.getEffectAge(this, 9) }),
        game.actions.draw(player, { age: game.getEffectAge(this, 9) }),
      ].filter(card => card !== undefined)

      const toReturn = game.actions.chooseCard(player, cards, { title: 'Choose a card to return' })

      if (toReturn) {
        game.actions.return(player, toReturn)
        cards.splice(cards.indexOf(toReturn), 1)
      }

      if (cards.length > 0) {
        game.actions.foreshadow(player, cards[0])
      }
    }
  ],
}
