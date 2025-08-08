module.exports = {
  name: `X-Ray`,
  color: `blue`,
  age: 8,
  expansion: `echo`,
  biscuits: `hl&8`,
  dogmaBiscuit: `l`,
  echo: `Draw and tuck an {8}.`,
  dogma: [
    `For every three {l} on your board, draw and foreshadow a card of any value.`,
    `You may splay your yellow cards up.`
  ],
  dogmaImpl: [
    (game, player) => {
      const leafs = game.getBiscuitsByPlayer(player).l
      const count = Math.floor(leafs / 3)

      for (let i = 0; i < count; i++) {
        const age = game.aChooseAge(player)
        game.aDrawAndForeshadow(player, age)
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['yellow'], 'up')
    }
  ],
  echoImpl: (game, player) => {
    game.aDrawAndTuck(player, game.getEffectAge(this, 8))
  },
}
