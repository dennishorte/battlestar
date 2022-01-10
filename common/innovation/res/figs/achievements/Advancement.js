module.exports = function() {
  this.id = 'Advancement'
  this.name = 'Advancement'
  this.exp = 'figs'
  this.text = 'Draw a card of value two higher than your highest top card.'
  this.alt = ''
  this.implSteps = [
    {
      description: 'Draw a card of value two higher than your highest top card.',
      func(context, player) {
        const { game } = context
        const highest = game.getHighestTopCard(player)
        return game.aDraw(context, player, highest.age + 2)
      }
    },
  ]
}
