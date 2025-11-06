module.exports = {
  id: `Hatshepsut`,  // Card names are unique in Innovation
  name: `Hatshepsut`,
  color: `green`,
  age: 1,
  expansion: `figs`,
  biscuits: `1c*h`,
  dogmaBiscuit: `c`,
  karma: [
    `If you would draw a card of value higher than 1 and you have a {1} in your hand, first return all cards from your hand and draw two cards of that value.`
  ],
  karmaImpl: [
    {
      trigger: 'draw',
      kind: 'would-first',
      matches: (game, player, { age }) => {
        const ageCondition = age > 1
        const handCondition = game
          .cards.byPlayer(player, 'hand')
          .filter(c => c.getAge() === game.getEffectAge(this, 1))
          .length > 0

        return ageCondition && handCondition
      },
      func: (game, player, { age }) => {
        game.actions.returnMany(player, game.cards.byPlayer(player, 'hand'))
        game.actions.draw(player, { age })
        game.actions.draw(player, { age })
      }
    }
  ]
}
