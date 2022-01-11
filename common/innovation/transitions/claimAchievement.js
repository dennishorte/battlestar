module.exports = function(context) {
  const { game, actor } = context
  const { achievement } = context.data

  const sourceZone = game.getZoneByCard(achievement)
  const targetZone = game.getAchievements(actor)

  game.mMoveCard(sourceZone, targetZone, achievement)
  game.mLog({
    template: '{player} achieves {achievement}',
    args: {
      player: actor,
      achievement: achievement,
    }
  })
  return context.done()
}
