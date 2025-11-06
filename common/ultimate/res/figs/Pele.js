
module.exports = {
  id: `Pele`,  // Card names are unique in Innovation
  name: `Pele`,
  color: `purple`,
  age: 9,
  expansion: `figs`,
  biscuits: `ha*c`,
  dogmaBiscuit: `c`,
  karma: [
    `You may issue a Rivalry Decree with any two figures.`,
    `If you would tuck a yellow card after tucking a green card in the same turn, instead you win.`
  ],
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
        game.youWin(player, this.name)
      }
    }
  ]
}
