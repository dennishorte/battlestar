export default {
  id: `Sunshu Ao`,  // Card names are unique in Innovation
  name: `Sunshu Ao`,
  color: `yellow`,
  age: 1,
  expansion: `figs`,
  biscuits: `h1pk`,
  dogmaBiscuit: `k`,
  karma: [
    `If you would meld a non-figure with a Meld action, instead self-execute it.`,
    `If you would score a sixth card this turn, first draw and achieve a {1}.`,
    `If you would tuck a sixth card this turn, first draw and achieve a {1}.`,
  ],
  karmaImpl: [
    {
      trigger: 'meld',
      kind: 'would-instead',
      matches: (game, player, opts) => {
        return !opts.card.checkIsFigure() && opts.asAction
      },
      func: (game, player, { card, self }) => {
        game.aSelfExecute(self, player, card)
      },
    },
    {
      trigger: 'score',
      kind: 'would-first',
      matches: (game, player) => {
        return game.state.scoreCount[player.name] === 5
      },
      func: (game, player, { self }) => {
        const card = game.actions.draw(player, { age: game.getEffectAge(self, 1) })
        game.actions.claimAchievement(player, { card })
      }
    },
    {
      trigger: 'tuck',
      kind: 'would-first',
      matches: (game, player) => {
        return game.state.tuckCount[player.name] === 5
      },
      func: (game, player, { self }) => {
        const card = game.actions.draw(player, { age: game.getEffectAge(self, 1) })
        game.actions.claimAchievement(player, { card })
      }
    },
  ]
}
