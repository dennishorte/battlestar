const { GameOverEvent } = require('../../../lib/game.js')

module.exports = {
  id: `Pele`,  // Card names are unique in Innovation
  name: `Pele`,
  color: `purple`,
  age: 9,
  expansion: `figs`,
  biscuits: `ha*c`,
  dogmaBiscuit: `c`,
  echo: ``,
  karma: [
    `You may issue a Rivalry Decree with any two figures.`,
    `If you would tuck a yellow card after tucking a green card in the same turn, instead you win.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Rivalry',
    },
    {
      trigger: 'tuck',
      kind: 'would-instead',
      matches: (game, player, { card }) => {
        const greenCondition = game.state.tuckedGreenForPele.includes(player)
        const yellowCondition = card.color === 'yellow'
        return greenCondition && yellowCondition
      },
      func: (game, player) => {
        throw new GameOverEvent({
          player,
          reason: this.name
        })
      }
    }
  ]
}
