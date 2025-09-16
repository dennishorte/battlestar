module.exports = {
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
    game.aDrawAndForeshadow(player, age)
    game.aDrawAndForeshadow(player, age)
    game.aDrawAndForeshadow(player, age)
  }
}
