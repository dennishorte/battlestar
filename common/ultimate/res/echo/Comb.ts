import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
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
      const color = game.actions.choose(player, game.util.colors(), { title: 'Choose a Color' })[0]
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
} satisfies AgeCardData
