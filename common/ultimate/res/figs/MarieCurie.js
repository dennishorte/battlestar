const util = require('../../../lib/util.js')

module.exports = {
  id: `Marie Curie`,  // Card names are unique in Innovation
  name: `Marie Curie`,
  color: `blue`,
  age: 8,
  expansion: `figs`,
  biscuits: `f&hf`,
  dogmaBiscuit: `f`,
  karma: [
    `Each different value present in your score pile above 6 counts as an achievement.`
  ],
  karmaImpl: [
    {
      trigger: 'extra-achievements',
      func: (game, player) => {
        const ages = game
          .cards.byPlayer(player, 'score')
          .filter(card => card.getAge() > 6)
          .map(card => card.getAge())
        return util.array.distinct(ages).length
      }
    }
  ]
}
