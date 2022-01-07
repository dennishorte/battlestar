module.exports = function(context) {
  const { game, actor } = context
  const { card } = context.data
  game.mMeld(actor, card)
  return context.return(card)
}
