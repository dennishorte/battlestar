module.exports = function(context) {
  const { game, actor } = context
  const { age } = context.data

  let exp = 'base'
  if (game.getExpansionList().includes('echo')) {
    throw new Error('Drawing cards not supported in Echoes of the Past yet.')
  }

  game.mDraw(actor, exp, age)
  return context.done()
}
