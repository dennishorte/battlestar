export default {
  name: 'Wealth',
  shortName: 'wlth',
  expansion: 'echo',
  text: 'Have eight visible bonuses on your board.',
  alt: 'Palampore',
  isSpecialAchievement: true,
  checkPlayerIsEligible: function(game, player, reduceCost) {
    const targetCount = reduceCost ? 7 : 8
    return game.getBonuses(player).length >= targetCount
  },
}
