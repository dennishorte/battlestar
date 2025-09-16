module.exports = {
  name: `Boerhavve Silver Microscope`,
  color: `blue`,
  age: 5,
  expansion: `arti`,
  biscuits: `sfsh`,
  dogmaBiscuit: `s`,
  dogma: [
    `Return the lowest card in your hand and the lowest top card on your board. Draw and score a card of value equal to the sum of the values of the cards returned.`
  ],
  dogmaImpl: [
    (game, player) => {
      const lowestHandCards = game.util.lowestCards(game.cards.byPlayer(player, 'hand'))
      const lowestBoardCards = game.util.lowestCards(game.cards.tops(player))

      const cards1 = game.actions.chooseAndReturn(player, lowestHandCards) || []
      const cards2 = game.actions.chooseAndReturn(player, lowestBoardCards) || []

      const returnedSum = []
        .concat(cards1, cards2)
        .map(card => card.getAge())
        .reduce((agg, next) => agg + next, 0)

      game.actions.drawAndScore(player, returnedSum)
    }
  ],
}
