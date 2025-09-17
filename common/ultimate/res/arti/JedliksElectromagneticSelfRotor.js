module.exports = {
  name: `Jedlik's Electromagnetic Self-Rotor`,
  color: `red`,
  age: 7,
  expansion: `arti`,
  biscuits: `hiss`,
  dogmaBiscuit: `s`,
  dogma: [
    `Draw and score an {8}. Draw and meld an {8}. Claim an achievement of value 8 if it is available, ignoring eligibility.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      game.actions.drawAndScore(player, game.getEffectAge(self, 8))
      game.actions.drawAndMeld(player, game.getEffectAge(self, 8))

      const choices = game
        .getAvailableAchievements(player)
        .filter(ach => ach.age === 8)

      game.actions.chooseAndAchieve(player, choices)
    }
  ],
}
