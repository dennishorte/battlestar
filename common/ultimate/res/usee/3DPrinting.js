module.exports = {
  name: `3D Printing`,
  color: `purple`,
  age: 10,
  expansion: `usee`,
  biscuits: `siih`,
  dogmaBiscuit: `i`,
  dogma: [
    `Return a top or bottom card on your board. Achieve one of your secrets of value equal to the returned card regardless of eligibility, then safeguard an available standard achievement. If you do, repeat this effect.`
  ],
  dogmaImpl: [
    (game, player) => {
      const repeatEffect = () => {
        const topCards = game.getTopCards(player)
        const bottomCards = game.getBottomCards(player)
        const choices = topCards.concat(bottomCards)

        const returned = game.actions.chooseAndReturn(player, choices)[0]

        if (returned) {
          const age = returned.age
          const secretOptions = game
            .cards.byPlayer(player, 'safe')
            .filter(c => c.getAge() === age)

          const secret = game.actions.chooseCards(player, secretOptions, {
            title: 'Choose a secret to achieve',
            hidden: true,
          })[0]

          if (secret) {
            game.actions.claimAchievement(player, secret)
          }

          const standard = game.actions.chooseCards(player, game.getAvailableStandardAchievements(player), {
            title: 'Choose a standard achievement to safeguard',
            hidden: true
          })[0]

          if (standard) {
            game.aSafeguard(player, standard)
          }

          if (secret && standard) {
            repeatEffect()
          }
        }
      }

      repeatEffect() // Start the repeating effect
    },
  ],
}
