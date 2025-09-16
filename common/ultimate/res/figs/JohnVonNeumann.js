module.exports = {
  id: `John Von Neumann`,  // Card names are unique in Innovation
  name: `John Von Neumann`,
  color: `red`,
  age: 8,
  expansion: `figs`,
  biscuits: `hii&`,
  dogmaBiscuit: `i`,
  echo: `Draw and reveal two {9}. If either is purple, return them.`,
  karma: [
    `When you meld this card, return all opponents' top figures.`,
    `Each card in your hand provides two additional {i}.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: (game, player) => {
    const card1 = game.aDrawAndReveal(player, game.getEffectAge(this, 9))
    const card2 = game.aDrawAndReveal(player, game.getEffectAge(this, 9))

    if (card1.color === 'purple' || card2.color === 'purple') {
      game.log.add({
        template: '{player} drew a purple card',
        args: { player }
      })
      game.aReturnMany(player, [card1, card2])
    }
  },
  karmaImpl: [
    {
      trigger: 'when-meld',
      func: (game, player) => {
        const figures = game
          .getPlayerOpponents(player)
          .flatMap(player => game.getTopCards(player))
          .filter(card => card.checkIsFigure())
        game.aReturnMany(player, figures)
      }
    },
    {
      trigger: 'calculate-biscuits',
      func: (game, player) => {
        const output = game.utilEmptyBiscuits()
        output.i = game.getCardsByZone(player, 'hand').length * 2
        return output
      }
    }
  ]
}
