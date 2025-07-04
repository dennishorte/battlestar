module.exports = {
  name: 'Anonymity',
  shortName: 'anon',
  expansion: 'usee',
  text: 'Have a top card on your board of vaue 7 or higher and no standard achievements.',
  alt: 'Masquerade',
  isSpecialAchievement: true,
  checkPlayerIsEligible: function(game, player, reduceCost) {
    const age = reduceCost ? 6 : 7
    const numAchievements = reduceCost ? 1 : 0

    const topCardAges = game
      .getTopCards(player)
      .map(card => card.getAge())

    const topCardMaxAge = Math.max(...topCardAges)

    const numStandardAchievements = game
      .getCardsByZone(player, 'achievements')
      .filter(card => card.checkIsStandardAchievement())
      .length

    return topCardMaxAge >= age && numStandardAchievements <= numAchievements
  },
}
