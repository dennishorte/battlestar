export default {
  name: 'Zen',
  shortName: 'zen',
  expansion: 'usee',
  text: 'Have a top card on your board of value 6 or higher and no top card on your board of odd value.',
  alt: 'Meteorology',
  isSpecialAchievement: true,
  checkPlayerIsEligible: function(game, player, reduceCost) {
    const targetAge = reduceCost ? 5 : 6
    const topCardAges = game
      .cards.tops(player)
      .map(card => card.getAge())
    const topCardMaxAge = Math.max(...topCardAges)

    const targetOdd = reduceCost ? 1 : 0
    const numOdd = game
      .cards.tops(player)
      .filter(card => card.getAge() % 2 === 1)
      .length

    return topCardMaxAge >= targetAge && numOdd <= targetOdd
  },
}
