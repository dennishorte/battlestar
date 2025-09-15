module.exports = {
  name: `Telegraph`,
  color: `green`,
  age: 7,
  expansion: `echo`,
  biscuits: `hiis`,
  dogmaBiscuit: `i`,
  echo: [],
  dogma: [
    `You may choose another player and a color and match your splay in that color to theirs.`,
    `You may splay your blue cards up.`,
    `If Telegraph was foreseen, splay all your splayed colors up.`,
  ],
  dogmaImpl: [
    (game, player) => {
      // All of the possibilities need to be included in order to support Blackmail's may becomes must feature.
      const choices = game
        .players
        .other(player)
        .map(other => {
          return {
            title: other.name,
            choices: game.util.colors().map(color => {
              const splay = game.zones.byPlayer(other, color).splay
              return `${color} ${splay}`
            }),
            min: 0,
          }
        })

      const choice = game.actions.choose(player, choices, { min: 0, max: 1 })[0].selection[0]
      const [color, direction] = choice.split(' ')
      game.actions.splay(player, color, direction)
    },

    (game, player) => {
      game.actions.chooseAndSplay(player, ['blue'], 'up')
    },

    (game, player, { foreseen, self }) => {
      game.log.addForeseen(foreseen, self)
      if (foreseen) {
        for (const color of game.util.colors()) {
          const currentSplay = game.zones.byPlayer(player, color).splay
          if (currentSplay !== 'up' && currentSplay !== 'none') {
            game.actions.splay(player, color, 'up')
          }
        }
      }
    },
  ],
  echoImpl: [],
}
