module.exports = {
  name: `Comb`,
  color: `green`,
  age: 1,
  expansion: `echo`,
  biscuits: `kklh`,
  dogmaBiscuit: `k`,
  echo: [],
  dogma: [
    `Choose a color, then draw and reveal five {1}s. Return the drawn cards that do not match the chosen color. If Comb was foreseen, return all cards of the chosen color from all boards.`
  ],
  dogmaImpl: [
    (game, player, { foreseen, self }) => {
      const color = game.aChoose(player, game.utilColors(), { title: 'Choose a Color' })[0]
      const cards = [
        game.aDrawAndReveal(player, game.getEffectAge(this, 1)),
        game.aDrawAndReveal(player, game.getEffectAge(this, 1)),
        game.aDrawAndReveal(player, game.getEffectAge(this, 1)),
        game.aDrawAndReveal(player, game.getEffectAge(this, 1)),
        game.aDrawAndReveal(player, game.getEffectAge(this, 1)),
      ].filter(card => card !== undefined)

      const others = cards.filter(card => card.color !== color)
      game.aReturnMany(player, others)

      if (foreseen) {
        game.mLogWasForeseen(self)

        const toReturn = game
          .getPlayerAll()
          .flatMap(p => game.getCardsByZone(p, color))

        game.aReturnMany(player, toReturn)
      }
    }
  ],
  echoImpl: [],
}
