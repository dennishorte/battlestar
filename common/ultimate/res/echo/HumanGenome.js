const { GameOverEvent } = require('../../../lib/game.js')

module.exports = {
  name: `Human Genome`,
  color: `blue`,
  age: 10,
  expansion: `echo`,
  biscuits: `ssah`,
  dogmaBiscuit: `s`,
  echo: [],
  dogma: [
    `You may draw and score a card of any value. Take a bottom card from your board into your hand. If the values of all the cards in your hand match the values of all the card in your score pile, exactly, you win.`
  ],
  dogmaImpl: [
    (game, player) => {
      const drawAndScore = game.aYesNo(player, 'Draw and score a card of any value?')
      if (drawAndScore) {
        const age = game.actions.chooseAge(player)
        game.actions.drawAndScore(player, age)
      }

      const choices = game
        .util.colors()
        .map(color => game.getBottomCard(player, color))
        .filter(card => card !== undefined)
      game.actions.chooseAndTransfer(player, choices, game.zones.byPlayer(player, 'hand'), {
        title: 'Choose a bottom card to transfer to your hand',
      })

      const scoreValues = game
        .cards.byPlayer(player, 'score')
        .map(card => card.getAge())
        .sort()
      const handValues = game
        .cards.byPlayer(player, 'hand')
        .map(card => card.getAge())
        .sort()

      if (scoreValues.join('') === handValues.join('')) {
        throw new GameOverEvent({
          player,
          reason: this.name
        })
      }
      else {
        game.mLog({
          template: 'Score values do not match hand values.'
        })
      }
    }
  ],
  echoImpl: [],
}
