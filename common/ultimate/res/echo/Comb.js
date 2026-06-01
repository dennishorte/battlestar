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
      const colorOptions = game.util.colors().map(c =>
        game.actions.option({ id: c, title: c, kind: 'color' })
      )
      const colorPick = game.actions.choose(player, colorOptions, { title: 'Choose a Color' })[0]
      const color = (colorPick && typeof colorPick === 'object') ? colorPick.id : colorPick
      const cards = [
        game.actions.drawAndReveal(player, game.getEffectAge(self, 1)),
        game.actions.drawAndReveal(player, game.getEffectAge(self, 1)),
        game.actions.drawAndReveal(player, game.getEffectAge(self, 1)),
        game.actions.drawAndReveal(player, game.getEffectAge(self, 1)),
        game.actions.drawAndReveal(player, game.getEffectAge(self, 1)),
      ].filter(card => card !== undefined)

      const others = cards.filter(card => card.color !== color)
      game.actions.returnMany(player, others)

      game.log.addForeseen(foreseen, self)
      if (foreseen) {
        const toReturn = game
          .players
          .all()
          .flatMap(p => game.cards.byPlayer(p, color))

        game.actions.returnMany(player, toReturn)
      }
    }
  ],
  echoImpl: [],
}
