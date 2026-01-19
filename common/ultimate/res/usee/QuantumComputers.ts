export default {
  name: `Quantum Computers`,
  color: `blue`,
  age: 11,
  expansion: `usee`,
  biscuits: `iihi`,
  dogmaBiscuit: `i`,
  dogma: [
    `I demand you flip a coin! If you lose the flip, you lose!`,
    // `Flip a coin. If you win the flip, this effect is complete. If you lose the flip, return one of your secrets. If you don't, you lose. Otherwise, repeat this effect.`
    `Flip a coin until you win the flip. Each time you lose a flip during this effect, return a secret or lose the game.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const lose = !game.actions.flipCoin(player)
      if (lose) {
        game.aYouLose(player, self)
      }
    },

    (game, player, { self }) => {
      while (true) {
        if (game.actions.flipCoin(player)) {
          game.log.add({
            template: '{player} wins the coin flip and the effect ends.',
            args: { player },
          })
          break
        }

        const secrets = game.cards.byPlayer(player, 'safe')
        const returned = game.actions.chooseAndReturn(player, secrets, {
          title: 'Return a secret',
        })

        if (returned.length === 0) {
          game.log.add({
            template: '{player} has no secrets to return and loses the game!',
            args: { player },
          })
          game.aYouLose(player, self)
          break
        }
      }
    }
  ],
}
