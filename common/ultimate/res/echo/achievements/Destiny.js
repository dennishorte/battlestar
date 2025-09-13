module.exports = {
  name: 'Destiny',
  shortName: 'dest',
  expansion: 'echo',
  text: 'Have five cards forecasted',
  alt: 'Barometer',
  isSpecialAchievement: true,
  checkPlayerIsEligible: function(game, player, reduceCost) {
    const targetCount = reduceCost ? 4 : 5
    return game.getZoneByPlayer(player, 'forecast').cards().length >= targetCount
  },
}
