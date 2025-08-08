module.exports = {
  name: `Kaleidoscope`,
  color: `purple`,
  age: 6,
  expansion: `echo`,
  biscuits: `6shs`,
  dogmaBiscuit: `s`,
  echo: [],
  dogma: [
    `Draw and meld a {7}. You may splay your cards of that color right.`
  ],
  dogmaImpl: [
    (game, player) => {
      const card = game.aDrawAndMeld(player, game.getEffectAge(this, 7))
      if (card) {
        game.aChooseAndSplay(player, [card.color], 'right')
      }
    }
  ],
  echoImpl: [],
}
