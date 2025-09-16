module.exports = {
  name: `Pavlovian Tusk`,
  color: `red`,
  age: 1,
  expansion: `arti`,
  biscuits: `hckc`,
  dogmaBiscuit: `c`,
  dogma: [
    `Draw three cards of value equal to your top green card. Return one of the drawn cards. Score one of the drawn cards.`
  ],
  dogmaImpl: [
    (game, player) => {
      const topGreen = game.getTopCard(player, 'green')
      const age = topGreen ? topGreen.age : 1
      const cards = [
        game.aDraw(player, { age }),
        game.aDraw(player, { age }),
        game.aDraw(player, { age }),
      ]

      const returned = game.actions.chooseAndReturn(player, cards) || []
      const remainining = cards.filter(card => !returned.includes(card))
      game.actions.chooseAndScore(player, remainining)
    }
  ],
}
