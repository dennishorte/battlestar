module.exports = function(context) {
  const { game, actor } = context
  const { isShareBonus } = context.data

  // Determine which expansion to draw from.
  let exp = 'base'
  if (game.getExpansionList().includes('echo')) {
    throw new Error('Drawing cards not supported in Echoes of the Past yet.')
  }
  if (
    game.getExpansionList().includes('figs')
    && isShareBonus
    && exp === 'base'
  ) {
    exp = 'figs'
  }

  // If age is not specified, draw based on player's current highest top card.
  const baseAge = context.data.age || game.getHighestTopCard(actor).age || 1

  // Adjust age based on empty decks.
  const { adjustedAge, adjustedExp } = game.getAdjustedDeck(baseAge, exp)

  const card = game.mDraw(actor, adjustedExp, adjustedAge)
  return context.return([card.id])
}
