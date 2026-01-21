module.exports = {
  name: `Earhart's Lockheed Electra 10E`,
  color: `blue`,
  age: 8,
  expansion: `arti`,
  biscuits: `ihii`,
  dogmaBiscuit: `i`,
  dogma: [
    `For each value below nine, junk a top card of that value from your board, in descending order. If there is a junked card of each value below nine, you win.`,
    `Claim an available standard achievement, ignoring eligibility.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      for (let i = 8; i >= game.getMinAge(); i--) {
        const choices = game
          .cards
          .tops(player)
          .filter(card => card.getAge() === i)

        if (!choices) {
          game.log.add({ template: `no cards of value ${i}` })
          continue
        }

        game.actions.chooseAndJunk(player, choices)
      }

      const junkCards = game.cards.byZone('junk')
      const requiredAges = game.getAges().filter(age => age < 9)
      const junkedAges = requiredAges.filter(age => junkCards.some(card => card.getAge() === age))
      if (junkedAges.length === requiredAges.length) {
        game.youWin(player, self.name)
      }
    },

    (game, player) => {
      const achievements = player.availableStandardAchievements()
      game.actions.chooseAndAchieve(player, achievements)
    }
  ],
}
