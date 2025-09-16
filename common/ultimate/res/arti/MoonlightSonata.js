module.exports = {
  name: `Moonlight Sonata`,
  color: `purple`,
  age: 6,
  expansion: `arti`,
  biscuits: `sshs`,
  dogmaBiscuit: `s`,
  dogma: [
    `Choose a color on your board having the highest top card. Meld the bottom card on your board of that color. If that color has more than one card, claim an achievement, ignoring eligibility.`
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = game
        .utilHighestCards(game.cards.tops(player))
        .map(card => card.color)
      const colors = game.actions.choose(player, choices, { title: 'Choose a color' })
      if (colors && colors.length > 0) {
        const color = colors[0]
        const cards = game.cards.byPlayer(player, color)
        game.actions.meld(player, cards[cards.length - 1])

        if (cards.length > 1) {
          const achs = game.getAvailableAchievementsRaw(player)
          game.actions.chooseAndAchieve(player, achs)
        }
      }
    }
  ],
}
