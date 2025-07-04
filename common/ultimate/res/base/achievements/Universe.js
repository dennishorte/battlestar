module.exports = {
  name: 'Universe',
  shortName: 'univ',
  expansion: 'base',
  text: 'Have five top cards of value 8+.',
  alt: 'Astronmy',
  isSpecialAchievement: true,
  checkPlayerIsEligible: function(game, player, reduceCost) {
    const targetAge = reduceCost ? 7 : 8
    const targetCount = reduceCost ? 4 : 5

    const matchCount = game
      .getTopCards(player)
      .map(card => card.getAge())
      .filter(age => age >= targetAge)
      .length

    return matchCount >= targetCount
  },
}
