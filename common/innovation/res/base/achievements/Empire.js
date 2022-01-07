module.exports = function() {
  this.id = 'Empire'
  this.name = 'Empire'
  this.exp = 'base'
  this.text = 'Have three biscuits of each of the six biscuit types.'
  this.alt = 'Construction'
  this.triggerImpl = [
    {
      listen: 'board-changed',
      func(game, event) {
        const player = event.player
        if (this.checkPlayerIsEligible(game, player)) {
          throw new Error('not implemented')
          return context.next({
            actor: player,
            name: 'achieve-special',
            data: {
              name: 'Empire'
            }
          })
        }
      }
    },
  ],
  this.checkPlayerIsEligible = function(game, player) {
    const biscuits = game.getBiscuits(player)
    return Object.values(biscuits.final).every(count => count >= 3)
  }
}
