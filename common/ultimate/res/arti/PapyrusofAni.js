module.exports = {
  name: `Papyrus of Ani`,
  color: `red`,
  age: 1,
  expansion: `arti`,
  biscuits: `lllh`,
  dogmaBiscuit: `l`,
  dogma: [
    // `Return a purple card from your hand. If you do, draw and reveal a card of any type of value two higher. If the drawn card is purple, meld is and execute each of its non-demand dogma effects. Do not share them.`
    `Return a purple card from your hand. If you do, draw and reveal a card of value two higher. If the drawn card is purple, meld is and execute each of its non-demand dogma effects. Do not share them.`
  ],
  dogmaImpl: [
    (game, player) => {
      const purples = game
        .getCardsByZone(player, 'hand')
        .filter(card => card.color === 'purple')
      const returned = game.aChooseAndReturn(player, purples)

      if (returned && returned.length > 0) {
        const returnedCard = returned[0]
        const drawn = game.aDraw(player, { age: returnedCard.age + 2 })

        if (drawn && drawn.color === 'purple') {
          game.aMeld(player, drawn)
          game.aCardEffects(player, drawn, 'dogma')
        }
      }
      else {
        game.mLogDoNothing(player)
      }
    }
  ],
}
