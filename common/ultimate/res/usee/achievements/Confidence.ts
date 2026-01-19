export default {
  name: 'Confidence',
  shortName: 'conf',
  expansion: 'usee',
  text: 'Have a top card of value 5 or higher and four or more secrets.',
  alt: 'Assassination',
  isSpecialAchievement: true,
  checkPlayerIsEligible: function(game, player, reduceCost) {
    const targetAge = reduceCost ? 4 : 5
    const topCardAges = game
      .cards.tops(player)
      .map(card => card.getAge())
    const topCardMaxAge = Math.max(...topCardAges)

    const targetNumSecrets = reduceCost ? 3 : 4
    const numSecrets = game
      .cards.byPlayer(player, 'safe')
      .length

    return topCardMaxAge >= targetAge && numSecrets >= targetNumSecrets
  },
}
