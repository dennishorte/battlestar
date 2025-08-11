module.exports = {
  name: `Air Conditioner`,
  color: `yellow`,
  age: 8,
  expansion: `echo`,
  biscuits: `h&9l`,
  dogmaBiscuit: `l`,
  echo: `You may score a card from your hand.`,
  dogma: [
    `I demand you return all cards from your score pile of value matching any of your top cards!`
  ],
  dogmaImpl: [
    (game, player) => {
      const topValues = game
        .cards.tops(player)
        .map(card => card.getAge())
      const toReturn = game
        .cards.byPlayer(player, 'score')
        .filter(card => topValues.includes(card.getAge()))
      game.aReturnMany(player, toReturn)
    }
  ],
  echoImpl: (game, player) => {
    game.aChooseAndScore(player, game.cards.byPlayer(player, 'hand'), { min: 0, max: 1 })
  },
}
