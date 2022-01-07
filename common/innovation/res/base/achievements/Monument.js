module.exports = function() {
  this.id = 'Monument'
  this.name = 'Monument'
  this.exp = 'base'
  this.text = 'Tuck or score six cards in one turn.'
  this.alt = 'Masonry'
  this.triggerImpl = [
    {
      listen: 'turn-start',
      func(game) {
        game.rk.put(game.state, 'cardsTucked', 0)
        game.rk.put(game.state, 'cardsScored', 0)
      }
    },
    {
      listen: ['score-after', 'tuck-after'],
      func(game, event) {
        // Only count activities that happen for the current player.
        // For example, some cards can cause an opponent to score a card.
        if (!event.actor === event.player) {
          return
        }

        let key
        if (event.name === 'tuck') {
          key = 'cardsTucked'
        }
        else if (event.name === 'score') {
          key = 'cardsScored'
        }
        game.mAdjustCounterByName(key, +1)

        if (this.checkPlayerIsEligible(game, event.actor)) {
          throw new Error(`not implemented`)
          return context.next({
            actor,
            name: 'achieve-special',
            data: {
              name: 'Monument'
            },
          })
        }
      }
    },
  ],
  this.checkPlayerIsEligible = function(game, player) {
    const playerIsCurrentPlayer = player.name === game.getPlayerCurrentTurn().name
    const tuckedOrScoredSix = (
      game.getCounterByName('cardsTucked') >= 6
      || game.getCounterByName('cardsScored')
    )

    return playerIsCurrentPlayer && tuckedOrScoredSix
  }
}
