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
            id: other.name,
            choices: game.util.colors().map(color => {
              const splay = game.zones.byPlayer(other, color).splay
              return game.actions.option({
                id: `${color}-${splay}`,
                title: `${color} ${splay}`,
                kind: 'splay-target',
              })
            }),
            min: 0,
          }
        })

      const sel = game.actions.choose(player, choices, { min: 0, max: 1 })[0].selection[0]
      let color, direction
      if (sel && typeof sel === 'object' && sel.id) {
        ;[color, direction] = sel.id.split('-')
      }
      else {
        // Legacy / bare-title selection from tests: title format is "color splay"
        const title = (sel && typeof sel === 'object') ? sel.title : sel
        ;[color, direction] = title.split(' ')
      }
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
