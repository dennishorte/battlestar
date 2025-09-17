module.exports = {
  id: `Amina Sukhera`,  // Card names are unique in Innovation
  name: `Amina Sukhera`,
  color: `red`,
  age: 4,
  expansion: `figs`,
  biscuits: `f*fh`,
  dogmaBiscuit: `f`,
  echo: ``,
  karma: [
    `When you meld this card, score all opponents' top figures of value 4.`,
    `Each top card with a {k} on your board counts as an available achievement for you.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'when-meld',
      func(game, player) {
        for (const opp of game.players.opponents(player)) {
          const topFigures = game
            .cards.tops(opp)
            .filter(card => card.checkIsFigure())
            .filter(card => card.getAge() === 4)
          game.actions.scoreMany(player, topFigures)
        }
      }
    },
    {
      trigger: 'list-achievements',
      func(game, player) {
        return game
          .cards.tops(player)
          .filter(card => card.biscuits.includes('k'))
      }
    }
  ]
}
