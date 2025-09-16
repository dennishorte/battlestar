
module.exports = {
  name: `Earhart's Lockheed Electra 10E`,
  color: `blue`,
  age: 8,
  expansion: `arti`,
  biscuits: `ihii`,
  dogmaBiscuit: `i`,
  dogma: [
    `For each value below nine, return a top card of that value from your board, in descending order. If you return eight cards, you win. Otherwise, claim an achievement, ignoring eligibility.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      let returned = 0
      for (let i = 8; i > 0; i--) {
        const choices = game
          .cards.tops(player)
          .filter(card => card.getAge() === i)

        if (!choices) {
          game.log.add({ template: `no cards of value ${i}` })
          continue
        }

        const cards = game.actions.chooseAndReturn(player, choices)
        if (cards && cards.length > 0) {
          returned += 1
        }
        else {
          game.log.add({ template: 'no card was returned' })
        }
      }

      game.log.add({
        template: '{player} returned {count} cards',
        args: { player, count: returned }
      })
      if (returned === 8) {
        game.youWin(player, self.name)
      }
      else {
        const achievements = game
          .getAvailableAchievementsRaw(player)
        game.actions.chooseAndAchieve(player, achievements)
      }
    }
  ],
}
