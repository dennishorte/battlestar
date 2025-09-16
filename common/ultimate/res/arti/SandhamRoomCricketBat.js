module.exports = {
  name: `Sandham Room Cricket Bat`,
  color: `purple`,
  age: 5,
  expansion: `arti`,
  biscuits: `llfh`,
  dogmaBiscuit: `l`,
  dogma: [
    `Draw and reveal a {6}. If it is red, claim an achievement, ignoring eligibility.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const card = game.aDrawAndReveal(player, game.getEffectAge(self, 6))
      if (card.color === 'red') {
        game.mLog({ template: 'Card is red' })
        const choices = game.getAvailableAchievementsRaw(player)
        game.aChooseAndAchieve(player, choices)
      }
      else {
        game.mLog({ template: 'Card is not red' })
      }
    }
  ],
}
