export default {
  id: `Zhang Heng`,  // Card names are unique in Innovation
  name: `Zhang Heng`,
  color: `blue`,
  age: 2,
  expansion: `figs`,
  biscuits: `lp2h`,
  dogmaBiscuit: `l`,
  karma: [
    `If a player would claim an achievement, first draw and tuck a {3}, then score all cards above the tucked card.`,
  ],
  karmaImpl: [
    {
      trigger: 'achieve',
      triggerAll: true,
      matches: () => true,
      func: (game, player, { self, owner }) => {
        const card = game.actions.drawAndTuck(owner, game.getEffectAge(self, 3))

        const toScore = game.cards.byPlayer(owner, card.color).filter(c => c.id !== card.id)
        game.actions.scoreMany(player, toScore)
      }
    }
  ]
}
