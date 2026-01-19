export default {
  name: `Babylonian Chronicles`,
  color: `red`,
  age: 2,
  expansion: `arti`,
  biscuits: `hkkk`,
  dogmaBiscuit: `k`,
  dogma: [
    `I compel you to transfer a top non-red card with a {k} from your board to my board!`,
    `Draw and score a {3}`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const choices = game
        .cards.tops(player)
        .filter(card => card.color !== 'red')
        .filter(card => card.checkHasBiscuit('k'))

      const card = game.actions.chooseCard(player, choices)
      if (card) {
        game.actions.transfer(player, card, game.zones.byPlayer(leader, card.color))
      }
    },

    (game, player, { self }) => {
      game.actions.drawAndScore(player, game.getEffectAge(self, 3))
    },
  ],
}
