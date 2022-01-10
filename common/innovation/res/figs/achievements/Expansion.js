module.exports = function() {
  this.id = 'Expansion'
  this.name = 'Expansion'
  this.exp = 'figs'
  this.text = 'Splay any one of your colors up.'
  this.alt = ''
  this.implSteps = [
    {
      description: 'Splay any one of your colors up.',
      func(context, player) {
        const { game } = context
        return game.aChooseAndSplay(context, {
          playerName: player.name,
          direction: 'up',
        })
      }
    },
  ]
}
