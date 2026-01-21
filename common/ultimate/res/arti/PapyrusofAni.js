module.exports = {
  name: `Papyrus of Ani`,
  color: `red`,
  age: 1,
  expansion: `arti`,
  biscuits: `lllh`,
  dogmaBiscuit: `l`,
  dogma: [
    // Drawing cities turned out to be too powerful.
    // `Return a purple card from your hand. If you do, draw and reveal a card of any type of value two higher. If the drawn card is purple, meld it and self-execute it.`

    `Return a purple card from your hand. If you do, draw and reveal a card of value two higher. If the drawn card is purple, meld it and self-execute it.`
  ],
  dogmaImpl: [
    (game, player) => {
      const purples = game
        .cards.byPlayer(player, 'hand')
        .filter(card => card.color === 'purple')
      const returned = game.actions.chooseAndReturn(player, purples)

      if (returned && returned.length > 0) {
        const returnedCard = returned[0]
        const drawn = game.actions.draw(player, { age: returnedCard.age + 2 })

        if (drawn && drawn.color === 'purple') {
          game.actions.meld(player, drawn)
          game.executeAllEffects(player, drawn, 'dogma')
        }
      }
      else {
        game.log.addDoNothing(player)
      }
    }
  ],
}
