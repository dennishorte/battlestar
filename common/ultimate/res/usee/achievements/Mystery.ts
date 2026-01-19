export default {
  name: 'Mystery',
  shortName: 'myst',
  expansion: 'usee',
  text: 'Have a top card on your board of value 9 or higher and fewer than five colors on your board.',
  alt: 'Secret History',
  isSpecialAchievement: true,
  checkPlayerIsEligible: function(game, player, reduceCost) {
    const targetAge = reduceCost ? 8 : 9
    const topCardAges = game
      .cards.tops(player)
      .map(card => card.getAge())
    const topCardMaxAge = Math.max(...topCardAges)

    const targetColors = reduceCost ? 4 : 5
    const actualColors = game.cards.tops(player).map(c => c.color).length

    return topCardMaxAge >= targetAge && actualColors < targetColors
  },
}
