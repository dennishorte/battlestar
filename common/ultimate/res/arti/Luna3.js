module.exports = {
  name: `Luna 3`,
  color: `blue`,
  age: 9,
  expansion: `arti`,
  biscuits: `fhff`,
  dogmaBiscuit: `f`,
  dogma: [
    `Return all cards from your score pile. Draw and score a card of value equal to the numer of cards returned.`
  ],
  dogmaImpl: [
    (game, player) => {
      const cards = game.actions.returnMany(player, game.cards.byPlayer(player, 'score')) || []
      game.actions.drawAndScore(player, cards.length)
    }
  ],
}
