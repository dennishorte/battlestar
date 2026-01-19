import util from '../../../lib/util.js'

export default {
  id: `Johannes Kepler`,  // Card names are unique in Innovation
  name: `Johannes Kepler`,
  color: `blue`,
  age: 4,
  expansion: `figs`,
  biscuits: `hsps`,
  dogmaBiscuit: `s`,
  karma: [
    `If you would take a Dogma action, instead do so while increasing each {} value in every effect during this action by the number of different top card values on your board greater than 3.`
  ],
  karmaImpl: [
    {
      trigger: 'dogma',
      kind: 'would-first',
      matches: () => true,
      func: (game, player) => {
        const topAgesGreaterThanThree = game
          .cards
          .tops(player)
          .filter(card => card.getAge() > 3)
          .map(card => card.getAge())
        const uniqueAges = util.array.distinct(topAgesGreaterThanThree)

        game.state.dogmaInfo.globalAgeIncrease = uniqueAges.length
        game.log.add({
          template: 'All {} values increased by {value} during this dogma action',
          args: {
            value: uniqueAges.length
          }
        })
      }
    }
  ]
}
