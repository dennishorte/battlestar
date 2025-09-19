module.exports = {
  name: 'World',
  shortName: 'wrld',
  expansion: 'base',
  text: 'Have twelve {i} on your board.',
  alt: 'Translation',
  isSpecialAchievement: true,
  checkPlayerIsEligible: function(game, player, reduceCost) {
    const targetInfo = reduceCost ? 11 : 12
    return player.biscuits().i >= targetInfo
  },
}
