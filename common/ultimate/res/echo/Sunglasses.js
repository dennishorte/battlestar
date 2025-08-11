
const util = require('../../../lib/util.js')

module.exports = {
  name: `Sunglasses`,
  color: `purple`,
  age: 3,
  expansion: `echo`,
  biscuits: `h3&k`,
  dogmaBiscuit: `k`,
  echo: `Score a card from your hand of a color you have splayed.`,
  dogma: [
    `You may either splay your purple cards in the direction one of your other colors is splayed, or you may splay one of your other colors in the direction that your purple cars are splayed.`
  ],
  dogmaImpl: [
    (game, player) => {
      const purpleSplay = game.zones.byPlayer(player, 'purple').splay
      const existingSplays = game
        .util.colors()
        .filter(color => color !== 'purple')
        .map(color => game.zones.byPlayer(player, color).splay)
        .filter(splay => splay !== 'none')
        .filter(splay => splay !== purpleSplay)
      const purpleChoices = util.array.distinct(existingSplays)

      const choices = []

      if (game.cards.byPlayer(player, 'purple').length > 1) {
        purpleChoices
          .map(splay => `purple ${splay}`)
          .forEach(choice => choices.push(choice))
      }

      if (purpleSplay !== 'none') {
        for (const color of game.util.colors()) {
          if (color === 'purple') {
            continue
          }
          const splay = game.zones.byPlayer(player, color).splay
          if (splay !== purpleSplay) {
            choices.push(`${color} ${purpleSplay}`)
          }
        }
      }

      const action = game.aChoose(player, choices, { title: 'Choose a color to splay', min: 0, max: 1 })[0]
      if (action) {
        const [color, direction] = action.split(' ')
        game.aSplay(player, color, direction)
      }
    }
  ],
  echoImpl: (game, player) => {
    const splayedColors = game
      .util.colors()
      .filter(color => game.zones.byPlayer(player, color).splay !== 'none')
    const choices = game
      .cards.byPlayer(player, 'hand')
      .filter(card => splayedColors.includes(card.color))
    game.aChooseAndScore(player, choices)
  },
}
