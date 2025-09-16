
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
        .getTopCards(player)
        .filter(card => card.expansion === 'arti')
      const card = game.actions.chooseCard(player, choices)
      if (card) {
        game.aTransfer(player, card, game.getZoneByPlayer(leader, card.color))
      }
    },

    (game, player) => {
      const grailIsTop = game
        .getTopCards(player)
        .filter(card => card.name === 'Holy Grail')
        .length > 0

      if (grailIsTop) {
        game.aDrawAndScore(player, 6)
      }
    }
  ],
}
