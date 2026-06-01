module.exports = {
  name: `Area 51`,
  color: `green`,
  age: 9,
  expansion: `usee`,
  biscuits: `shss`,
  dogmaBiscuit: `s`,
  dogma: [
    `You may splay your green cards up.`,
    `Choose to either draw a {e}, or safeguard an available standard achievement.`,
    `Reveal one of your secrets, and super-execute it if it is your turn.`
  ],
  dogmaImpl: [
    (game, player) => {
      game.actions.chooseAndSplay(player, ['green'], 'up')
    },
    (game, player, { self }) => {
      const drawTitle = 'Draw a ' + game.getEffectAge(self, 11)
      const choices = [
        game.actions.option({ id: 'draw', title: drawTitle }),
        game.actions.option({ id: 'safeguard', title: 'Safeguard a standard achievement' }),
      ]
      const pick = game.actions.choose(player, choices)[0]
      const choice = (pick && typeof pick === 'object') ? pick.id : pick

      if (choice === 'draw' || choice === drawTitle) {
        game.actions.draw(player, { age: game.getEffectAge(self, 11) })
      }
      else {
        const available = player.availableStandardAchievements()
        const achievement = game.actions.chooseCards(player, available, { hidden: true })[0]

        if (achievement) {
          game.actions.safeguard(player, achievement)
        }
      }
    },
    (game, player, { self }) => {
      const secrets = game.cards.byPlayer(player, 'safe')
      const secret = game.actions.chooseCards(player, secrets, {
        title: 'Choose a secret to reveal and execute',
        hidden: true,
      })[0]

      if (secret) {
        game.actions.reveal(player, secret)

        if (game.players.current() === player) {
          game.actions.superExecute(self, player, secret)
        }
      }
    }
  ],
}
