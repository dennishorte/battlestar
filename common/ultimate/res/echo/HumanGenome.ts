
export default {
  name: `Human Genome`,
  color: `blue`,
  age: 10,
  expansion: `echo`,
  biscuits: `s&ah`,
  dogmaBiscuit: `s`,
  echo: [`Draw an {b}`],
  dogma: [
    `You may draw and score a card of any value. Transfer your bottom red card to your hand. If the values of all the cards in your hand match the values of all the card in your score pile, exactly, you win.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const age = game.actions.chooseAge(player, null, { min: 0 })
      if (age !== undefined) {
        game.actions.drawAndScore(player, age)
      }

      const bottomRed = game.cards.bottom(player, 'red')
      if (bottomRed) {
        game.actions.transfer(player, bottomRed, game.zones.byPlayer(player, 'hand'))
      }

      const scoreValues = game
        .cards
        .byPlayer(player, 'score')
        .map(card => card.getAge())
        .sort()
      const handValues = game
        .cards
        .byPlayer(player, 'hand')
        .map(card => card.getAge())
        .sort()

      if (scoreValues.join('') === handValues.join('')) {
        game.youWin(player, self.name)
      }
      else {
        game.log.add({
          template: 'Score values do not match hand values.'
        })
      }
    }
  ],
  echoImpl: [
    (game, player, { self }) => {
      game.actions.draw(player, { age: game.getEffectAge(self, 11) })
    },
  ],
}
