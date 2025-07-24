module.exports = {
  name: `Illuminati`,
  color: `purple`,
  age: 6,
  expansion: `usee`,
  biscuits: `shss`,
  dogmaBiscuit: `s`,
  dogma: [
    `Reveal a card in your hand. Splay the card's color on your board right. Safeguard the top card on your board of that color. Safeguard an available achievement of value one higher than the secret.`
  ],
  dogmaImpl: [
    (game, player) => {
      const hand = game.zones.byPlayer(player, 'hand').cardlist()
      const card = game.actions.chooseAndReveal(player, hand)[0]

      if (card) {
        game.actions.splay(player, card.color, 'right')

        const topCard = game.getTopCard(player, card.color)
        const safeGuarded = game.actions.safeguard(player, topCard)

        if (!safeGuarded) {
          return
        }

        const availableAchievements = game.getAvailableStandardAchievements(player)
        const higherAchievement = availableAchievements.find(a => a.getAge() === safeGuarded.getAge() + 1)

        if (higherAchievement) {
          game.actions.safeguard(player, higherAchievement)
        }
        else {
          game.log.add({
            template: 'No available achievement of value {age} to safeguard',
            args: { age: card.getAge() + 1 }
          })
        }
      }
    },
  ],
}
