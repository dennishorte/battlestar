module.exports = {
  name: `Confession`,
  color: `purple`,
  age: 4,
  expansion: `usee`,
  biscuits: `ccch`,
  dogmaBiscuit: `c`,
  dogma: [
    `Return a top card with {k} of each color from your board. If you return none, meld a card from your score pile, then draw and score a {4}.`,
    `Draw a {4} for each {4} in your score pile.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const topCastleCards = game
        .getTopCards(player)
        .filter(c => c.checkHasBiscuit('k'))

      const returned = game.aReturnMany(player, topCastleCards)

      if (returned.length === 0) {
        game.actions.chooseAndMeld(player, game.cards.byPlayer(player, 'score'))
        game.aDrawAndScore(player, game.getEffectAge(self, 4))
      }
    },
    (game, player, { self }) => {
      const age = game.getEffectAge(self, 4)
      const scorePile = game
        .cards.byPlayer(player, 'score')
        .filter(c => c.getAge() === age)
        .length

      for (let i = 0; i < scorePile; i++) {
        game.aDraw(player, { age })
      }
    }
  ],
}
