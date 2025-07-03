module.exports = {
  name: `Enterprise`,
  color: `purple`,
  age: 4,
  expansion: `base`,
  biscuits: `hccc`,
  dogmaBiscuit: `c`,
  dogma: [
    `I demand you transfer a top non-purple card with a {c} from your board to my board. If you do, draw and meld a {4}.`,
    `You may splay your green cards right.`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      const choices = game
        .getTopCards(player)
        .filter(card => card.color !== 'purple')
        .filter(card => card.checkHasBiscuit('c'))
      const card = game.actions.chooseCard(player, choices)
      if (card) {
        const transferred = game.aTransfer(player, card, game.getZoneByPlayer(leader, card.color))
        if (transferred) {
          game.aDrawAndMeld(player, game.getEffectAge(self, 4))
        }
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['green'], 'right')
    }
  ],
}
