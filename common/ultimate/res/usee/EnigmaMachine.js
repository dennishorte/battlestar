module.exports = {
  name: `Enigma Machine`,
  color: `red`,
  age: 8,
  expansion: `usee`,
  biscuits: `iihi`,
  dogmaBiscuit: `i`,
  dogma: [
    `Choose to either safeguard all available standard achievements, transfer all your secrets to your hand, or transfer all cards in your hand to the available achievements.`,
    `Choose a color you have splayed left and splay it up.`
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = [
        game.actions.option({ id: 'safeguard-achievements', title: 'Safeguard all available standard achievements' }),
        game.actions.option({ id: 'secrets-to-hand', title: 'Transfer all your secrets to your hand' }),
        game.actions.option({ id: 'hand-to-achievements', title: 'Transfer all cards in your hand to the available achievements' }),
      ]
      const pick = game.actions.choose(player, choices)[0]
      const choice = (pick && typeof pick === 'object')
        ? (pick.id ?? pick.title)
        : pick

      if (choice === 'safeguard-achievements' || choice === 'Safeguard all available standard achievements') {
        const achievements = player.availableStandardAchievements()
        game.actions.safeguardMany(player, achievements)
      }
      else if (choice === 'secrets-to-hand' || choice === 'Transfer all your secrets to your hand') {
        const secrets = game.zones.byPlayer(player, 'safe').cardlist()
        game.actions.transferMany(player, secrets, game.zones.byPlayer(player, 'hand'))
      }
      else if (choice === 'hand-to-achievements' || choice === 'Transfer all cards in your hand to the available achievements') {
        const hand = game.zones.byPlayer(player, 'hand').cardlist()
        game.actions.transferMany(player, hand, game.zones.byId('achievements'))
      }
    },
    (game, player) => {
      const colors = game.util.colors().filter(color => {
        return game.zones.byPlayer(player, color).splay === 'left'
      })
      game.actions.chooseAndSplay(player, colors, 'up', { count: 1 })
    }
  ],
}
