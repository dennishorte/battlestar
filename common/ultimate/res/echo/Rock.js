const { GameOverEvent } = require('../../../lib/game.js')

module.exports = {
  name: `Rock`,
  color: `purple`,
  age: 9,
  expansion: `echo`,
  biscuits: `l9hl`,
  dogmaBiscuit: `l`,
  echo: ``,
  dogma: [
    `I demand you transfer your top green card to my hand! If Scissors is your new top green card, I win!`,
    `You may score a top card from your board. If Paper is your top green card, you win.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const card = game.getTopCard(player, 'green')
      if (card) {
        game.aTransfer(player, card, game.getZoneByPlayer(leader, 'hand'))

        const next = game.getTopCard(player, 'green')
        if (next && next.name === 'Scissors') {
          throw new GameOverEvent({
            player: leader,
            reason: this.name
          })
        }
      }
    },

    (game, player) => {
      game.aChooseAndScore(player, game.getTopCards(player), { min: 0, max: 1 })

      const card = game.getTopCard(player, 'green')
      if (card && card.name === 'Paper') {
        throw new GameOverEvent({
          player,
          reason: this.name
        })
      }
    }
  ],
  echoImpl: [],
}
