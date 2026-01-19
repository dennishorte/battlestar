export default {
  id: 'Trade',
  name: 'Trade',
  shortName: 'trad',
  expansion: 'figs',
  text: 'Draw and foreshadow three cards of value one higher than your highest top card.',
  alt: '',
  isSpecialAchievement: false,
  isDecree: true,
  decreeImpl: (game, player) => {
    const age = game.getHighestTopAge(player) + 1
    game.actions.drawAndForeshadow(player, age)
    game.actions.drawAndForeshadow(player, age)
    game.actions.drawAndForeshadow(player, age)
  }
}
