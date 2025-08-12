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
    (game, player, { self }) => {
      while (true) {
        const count = Math.floor(game.getBiscuitsByPlayer(player).f / 3)
        const tucked = []
        for (let i = 0; i < count; i++) {
          const card = game.actions.drawAndTuck(player, game.getEffectAge(self, 8))
          if (card) {
            tucked.push(card)
          }
        }

        if (tucked.some(card => card.color === 'green')) {
          game.log.add({
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
      game.actions.chooseAndSplay(player, ['red'], 'up')
    },
  ],
  echoImpl: [],
}
