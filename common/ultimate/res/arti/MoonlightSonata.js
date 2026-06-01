module.exports = {
  name: `Moonlight Sonata`,
  color: `purple`,
  age: 6,
  expansion: `arti`,
  biscuits: `sshs`,
  dogmaBiscuit: `s`,
  dogma: [
    `Choose a color on your board having the highest top card. Meld your bottom card of that color.`,
    `Claim an available standard achievement, ignoring eligibility. Junk an available standard achievement.`
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = game
        .util
        .highestCards(game.cards.tops(player))
        .map(card => card.color)
        .map(c => game.actions.option({ id: c, title: c, kind: 'color' }))
      const colors = game.actions.choose(player, choices, { title: 'Choose a color' })
      if (colors && colors.length > 0) {
        const pick = colors[0]
        const color = (pick && typeof pick === 'object') ? pick.id : pick
        const cards = game.cards.byPlayer(player, color)
        game.actions.meld(player, cards[cards.length - 1])
      }
    },

    (game, player) => {
      const achieveChoices = player.availableStandardAchievements()
      game.actions.chooseAndAchieve(player, achieveChoices)

      const junkChoices = player.availableStandardAchievements()
      game.actions.chooseAndJunk(player, junkChoices)
    },
  ],
}
