module.exports = {
  name: `Credit Card`,
  color: `green`,
  age: 9,
  expansion: `echo`,
  biscuits: `&c9h`,
  dogmaBiscuit: `c`,
  echo: `Draw and foreshadow a {9}.`,
  dogma: [
    `You may take a top non-green card from your board into your hand. If you do, draw and score a card of equal value.`,
    `You may splay your green cards up.`
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = game
        .getTopCards(player)
        .filter(card => card.color !== 'green')
      const card = game.aChooseCard(player, choices, {
        min: 0,
        max: 1,
        title: 'You may take a card into your hand.'
      })

      if (card) {
        game.aTransfer(player, card, game.getZoneByPlayer(player, 'hand'))
        game.aDrawAndScore(player, card.getAge())
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['green'], 'up')
    },
  ],
  echoImpl: (game, player) => {
    game.aDrawAndForeshadow(player, game.getEffectAge(this, 9))
  },
}
