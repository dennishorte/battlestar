const { GameOverEvent } = require('../../../lib/game.js')

module.exports = {
  name: `Parnell Pitch Drop`,
  color: `blue`,
  age: 8,
  expansion: `arti`,
  biscuits: `sssh`,
  dogmaBiscuit: `s`,
  dogma: [
    `Draw and meld a card of value one higher than the highest top card on your board. If the melded card has three {i}, you win.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const card = game.aDrawAndMeld(player, game.getHighestTopAge(player) + 1)
      if (card.biscuits.split('i').length - 1 === 3) {
        throw new GameOverEvent({
          player,
          reason: self.name
        })
      }
    }
  ],
}
