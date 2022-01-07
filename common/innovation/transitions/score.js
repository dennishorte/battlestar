module.exports = function(context) {
  const { game, actor } = context
  const { card, skipLog } = context.data
  game.mScore(actor, card)

  if (!skipLog) {
    game.mLog({
      template: '{player} scores {card}',
      args: {
        player: actor,
        card
      }
    })
  }
  return context.done()
}
