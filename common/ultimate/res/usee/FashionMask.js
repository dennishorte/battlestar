module.exports = {
  name: `Fashion Mask`,
  color: `yellow`,
  age: 11,
  expansion: `usee`,
  biscuits: `hlll`,
  dogmaBiscuit: `l`,
  dogma: [
    `Tuck a top card with {c} or {f} of each color on your board. You may safeguard one of the tucked cards.`,
    `Score all but the top five each of your yellow and purple cards. Splay those colors aslant.`
  ],
  dogmaImpl: [
    (game, player) => {
      const toTuck = game
        .getTopCards(player)
        .filter(card => card.checkHasBiscuit('c') || card.checkHasBiscuit('f'))

      const tucked = game.actions.tuckMany(player, toTuck)
      game.actions.chooseAndSafeguard(player, tucked, { min: 0 })
    },
    (game, player) => {
      const yellows = game
        .cards.byPlayer(player, 'yellow')
        .slice(5)

      const purples = game
        .cards.byPlayer(player, 'purple')
        .slice(5)

      const toScore = [...yellows, ...purples]

      game.actions.scoreMany(player, toScore)

      game.actions.splay(player, 'yellow', 'aslant')
      game.actions.splay(player, 'purple', 'aslant')
    }
  ],
}
