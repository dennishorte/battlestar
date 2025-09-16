module.exports = {
  id: 'Advancement',
  name: 'Advancement',
  shortName: 'advn',
  expansion: 'figs',
  text: 'Draw a card of value two higher than your highest top card.',
  alt: '',
  isSpecialAchievement: false,
  isDecree: true,
  decreeImpl: (game, player) => {
    const highestAge = game.getHighestTopAge(player)
    const decreeAge = highestAge + 2
    game.aDraw(player, { age: decreeAge })
  }
}
