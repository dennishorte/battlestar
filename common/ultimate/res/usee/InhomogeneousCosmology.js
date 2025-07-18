module.exports = {
  name: `Inhomogeneous Cosmology`,
  color: `blue`,
  age: 10,
  expansion: `usee`,
  biscuits: `ihii`,
  dogmaBiscuit: `i`,
  dogma: [
    `You may place a top card from your board on top of its deck. You may meld a card from your hand. If you do either, repeat this effect.`,
    `Draw an {11} for every color not on your board.`
  ],
  dogmaImpl: [
    (game, player) => {
      while (true) {
        const topCards = game.getTopCards(player)
        const handCards = game.cards.byPlayer(player, 'hand')

        const topCardChosen = game.actions.chooseCards(player, topCards, { min: 0, max: 1 })[0]
        if (topCardChosen) {
          game.log.add({
            template: '{player} puts {card} on top of its deck',
            args: { player, card: topCardChosen }
          })
          topCardChosen.moveTo(topCardChosen.home, 0)
        }

        const handCardMelded = game.aChooseAndMeld(player, handCards, { min: 0, max: 1 })[0]

        if (!topCardChosen && !handCardMelded) {
          break
        }
      }
    },
    (game, player, { self }) => {
      const missingColors = game
        .utilColors()
        .filter(color => game.cards.byPlayer(player, color).length === 0)

      missingColors.forEach(() => {
        game.aDraw(player, { age: game.getEffectAge(self, 11) })
      })
    }
  ],
}
