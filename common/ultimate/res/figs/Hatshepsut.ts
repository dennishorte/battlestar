export default {
  id: `Hatshepsut`,  // Card names are unique in Innovation
  name: `Hatshepsut`,
  color: `green`,
  age: 1,
  expansion: `figs`,
  biscuits: `1cph`,
  dogmaBiscuit: `c`,
  karma: [
    `If you would draw a card of value higher than 1 and you have a {1} in your hand, first return all cards from your hand and draw a card of that value for each card you return.`
  ],
  karmaImpl: [
    {
      trigger: 'draw',
      kind: 'would-first',
      matches: (game, player, { age, self }) => {
        const ageCondition = age > 1
        const handCondition = game
          .cards
          .byPlayer(player, 'hand')
          .filter(c => c.getAge() === game.getEffectAge(self, 1))
          .length > 0

        return ageCondition && handCondition
      },
      func: (game, player, { age }) => {
        const returned = game.actions.returnMany(player, game.cards.byPlayer(player, 'hand'))
        for (let i = 0; i < returned.length; i++) {
          game.actions.draw(player, { age })
        }
      }
    }
  ]
}
