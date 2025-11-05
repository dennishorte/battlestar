module.exports = {
  name: `Sandham Room Cricket Bat`,
  color: `purple`,
  age: 5,
  expansion: `arti`,
  biscuits: `llfh`,
  dogmaBiscuit: `l`,
  dogma: [
    `Draw and reveal a {6}. If it is red, claim an available standard achievement, ignoring eligibility. Otherwise, junk an available standard achievement.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const card = game.actions.drawAndReveal(player, game.getEffectAge(self, 6))
      const choices = game.getAvailableStandardAchievements(player)

      if (card.color === 'red') {
        game.log.add({ template: 'Card is red' })
        game.actions.chooseAndAchieve(player, choices)
      }
      else {
        game.log.add({ template: 'Card is not red' })
        game.actions.chooseAndJunk(player, choices)
      }
    }
  ],
}
