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
        'Safeguard all available standard achievements',
        'Transfer all your secrets to your hand',
        'Transfer all cards in your hand to the available achievements'
      ]
      const choice = game.actions.choose(player, choices)[0]

      if (choice === choices[0]) {
        const achievements = game.getAvailableStandardAchievements(player)
        game.actions.safeguardMany(player, achievements)
      }
      else if (choice === choices[1]) {
        const secrets = game.zones.byPlayer(player, 'safe').cardlist()
        game.actions.transferMany(player, secrets, game.zones.byPlayer(player, 'hand'))
      }
      else if (choice === choices[2]) {
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
