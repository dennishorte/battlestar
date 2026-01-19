export default {
  name: `Chronicle of Zuo`,
  color: `red`,
  age: 2,
  expansion: `arti`,
  biscuits: `chss`,
  dogmaBiscuit: `s`,
  dogma: [
    `If you have the least {k} or the least {c}, draw a {3}. If you have the least {s}, draw a {4}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const biscuits = game.getBiscuits()
      const castles = game
        .players
        .opponents(player)
        .map(opp => biscuits[opp.name].k)
        .sort((l, r) => l - r)
      const coins = game
        .players
        .opponents(player)
        .map(opp => biscuits[opp.name].c)
        .sort((l, r) => l - r)
      const lights = game
        .players
        .opponents(player)
        .map(opp => biscuits[opp.name].s)
        .sort((l, r) => l - r)

      if (biscuits[player.name].k < castles[0] || biscuits[player.name].c < coins[0]) {
        game.actions.draw(player, { age: game.getEffectAge(self, 3) })
      }

      if (biscuits[player.name].s < lights[0]) {
        game.actions.draw(player, { age: game.getEffectAge(self, 4) })
      }
    }
  ],
}
