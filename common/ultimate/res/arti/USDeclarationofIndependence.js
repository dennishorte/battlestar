module.exports = {
  name: `U.S. Declaration of Independence`,
  color: `red`,
  age: 6,
  expansion: `arti`,
  biscuits: `cssh`,
  dogmaBiscuit: `s`,
  dogma: [
    `I compel you to transfer the highest card in your hand to my hand, the highest card in your score pile to my score pile, and the highest top card with a {f} from yor board to my board!`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const hand = game.util.highestCards(game.cards.byPlayer(player, 'hand'))
      game.actions.chooseAndTransfer(player, hand, game.zones.byPlayer(leader, 'hand'))

      const score = game.util.highestCards(game.cards.byPlayer(player, 'score'))
      game.actions.chooseAndTransfer(player, score, game.zones.byPlayer(leader, 'score'))

      const cards = game.util.highestCards(
        game
          .cards.tops(player)
          .filter(card => card.checkHasBiscuit('f'))
      )
      const card = game.actions.chooseCard(player, cards, { title: 'Choose a top card to transfer' })
      if (card) {
        game.actions.transfer(player, card, game.zones.byPlayer(leader, card.color))
      }
    }
  ],
}
