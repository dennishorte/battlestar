module.exports = {
  name: `Heirloom`,
  color: `yellow`,
  age: 4,
  expansion: `usee`,
  biscuits: `fcfh`,
  dogmaBiscuit: `f`,
  dogma: [
    `Transfer one of your secrets to the available achievements and draw a card of value one higher than the transferred card. If you don't, safeguard an available achievement of value equal to the value of your top red card.`
  ],
  dogmaImpl: [
    (game, player) => {
      const secrets = game.cards.byPlayer(player, 'safe')
      const transferred = game.aChooseAndTransfer(player, secrets, game.zones.byId('achievements'))[0]

      if (transferred) {
        game.aDraw(player, { age: transferred.getAge() + 1 })
      }
      else {
        const topRed = game.getTopCard(player, 'red')
        if (topRed) {
          const value = topRed.getAge()
          const achievement = game.getAvailableAchievementsByAge(player, value)[0]
          if (achievement) {
            game.actions.safeguard(player, achievement)
          }
        }
      }
    },
  ],
}
