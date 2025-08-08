module.exports = {
  name: `Nylon`,
  color: `green`,
  age: 8,
  expansion: `echo`,
  biscuits: `8ffh`,
  dogmaBiscuit: `f`,
  echo: [],
  dogma: [
    `Draw and tuck an {8} for every three {f} on your board. If any of the tucked cards were green, repeat this dogma effect.`,
    `You may splay your red cards up.`
  ],
  dogmaImpl: [
    (game, player) => {
      while (true) {
        const count = Math.floor(game.getBiscuitsByPlayer(player).f / 3)
        const tucked = []
        for (let i = 0; i < count; i++) {
          const card = game.aDrawAndTuck(player, game.getEffectAge(this, 8))
          if (card) {
            tucked.push(card)
          }
        }

        if (tucked.some(card => card.color === 'green')) {
          game.mLog({
            template: '{player} tucked at least one green card; repeating.',
            args: { player }
          })
          continue
        }
        else {
          break
        }
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['red'], 'up')
    },
  ],
  echoImpl: [],
}
