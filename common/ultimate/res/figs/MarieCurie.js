const util = require('../../../lib/util.js')

module.exports = {
  id: `Marie Curie`,  // Card names are unique in Innovation
  name: `Marie Curie`,
  color: `blue`,
  age: 8,
  expansion: `figs`,
  biscuits: `f&hf`,
  dogmaBiscuit: `f`,
  echo: `Draw a {9}.`,
  karma: [
    `Each different value present in your score pile above 6 counts as an achievement.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: (game, player) => {
    game.actions.draw(player, { age: game.getEffectAge(this, 9) })
  },
  karmaImpl: [
    {
      trigger: 'extra-achievements',
      func: (game, player) => {
        const ages = game
          .getCardsByZone(player, 'score')
          .filter(card => card.getAge() > 6)
          .map(card => card.getAge())
        return util.array.distinct(ages).length
      }
    }
  ]
}
