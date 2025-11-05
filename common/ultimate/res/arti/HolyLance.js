
module.exports = {
  name: `Holy Lance`,
  color: `green`,
  age: 2,
  expansion: `arti`,
  biscuits: `klhk`,
  dogmaBiscuit: `k`,
  dogma: [
    `I compel you to transfer a top Artifact from your board to my board!`,
    `If Holy Grail is a top card on your board, draw and score a {6}.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const choices = game
        .cards.tops(player)
        .filter(card => card.expansion === 'arti')
      const card = game.actions.chooseCard(player, choices)
      if (card) {
        game.actions.transfer(player, card, game.zones.byPlayer(leader, card.color))
      }
    },

    (game, player) => {
      const grailIsTop = game
        .cards.tops(player)
        .filter(card => card.name === 'Holy Grail')
        .length > 0

      if (grailIsTop) {
        game.actions.drawAndScore(player, 6)
      }
    }
  ],
}
