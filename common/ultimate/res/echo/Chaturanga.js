module.exports = {
  name: `Chaturanga`,
  color: `purple`,
  age: 2,
  expansion: `echo`,
  biscuits: `c3ch`,
  dogmaBiscuit: `c`,
  echo: ``,
  dogma: [
    `Meld a card from your hand. Draw and foreshadow a card of value equal to the melded card.`,
    `If Chaturanga was foreseen, draw and foreshadow a card of value equal to the number of colors on your board.`
  ],
  dogmaImpl: [
    (game, player) => {
      const card = game.actions.chooseAndMeld(player, game.cards.byPlayer(player, 'hand'))[0]
      const age = card ? card.getAge() : 0
      game.actions.drawAndForeshadow(player, age)
    },

    (game, player, { foreseen, self }) => {
      if (foreseen) {
        game.log.addForeseen(self)
        const count = game.cards.tops(player).length
        game.actions.drawAndForeshadow(player, count)
      }
      else {
        game.log.addNoEffect()
      }
    },
  ],
  echoImpl: [],
}
