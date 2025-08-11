module.exports = {
  name: `Cell Phone`,
  color: `yellow`,
  age: 10,
  expansion: `echo`,
  biscuits: `ihai`,
  dogmaBiscuit: `i`,
  echo: ``,
  dogma: [
    `Draw a {0} for every two {i} on your board.`,
    `You may splay your green cards up.`,
    `You may tuck any number of cards with a {i} from your hand, splaying up each color you tucked into.`
  ],
  dogmaImpl: [
    (game, player) => {
      const count = Math.floor(game.getBiscuitsByPlayer(player).i / 2)
      for (let i = 0; i < count; i++) {
        game.actions.draw(player, { age: game.getEffectAge(this, 10) })
      }
    },

    (game, player) => {
      game.actions.chooseAndSplay(player, ['green'], 'up')
    },

    (game, player) => {
      const choices = game
        .cards.byPlayer(player, 'hand')
        .filter(card => card.checkHasBiscuit('i'))
      const tucked = game.actions.chooseAndTuck(player, choices, { min: 0, max: choices.length, title: 'Choose any number of cards to tuck.' })

      if (tucked) {
        for (const card of tucked) {
          if (game.zones.byPlayer(player, card.color).splay !== 'up') {
            game.aSplay(player, card.color, 'up')
          }
        }
      }
    },
  ],
  echoImpl: [],
}
