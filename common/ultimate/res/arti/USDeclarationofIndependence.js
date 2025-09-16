module.exports = {
  name: `U.S. Declaration of Independence`,
  color: `red`,
  age: 6,
  expansion: `arti`,
  biscuits: `ccsh`,
  dogmaBiscuit: `c`,
  dogma: [
    `I compel you to transfer the highest card in your hand to my hand, the highest card in your score pile to my score pile, and the highest top card with a {f} from yor board to my board!`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const hand = game.utilHighestCards(game.getCardsByZone(player, 'hand'))
      game.aChooseAndTransfer(player, hand, game.getZoneByPlayer(leader, 'hand'))

      const score = game.utilHighestCards(game.getCardsByZone(player, 'score'))
      game.aChooseAndTransfer(player, score, game.getZoneByPlayer(leader, 'score'))

      const cards = game.utilHighestCards(
        game
          .getTopCards(player)
          .filter(card => card.checkHasBiscuit('f'))
      )
      const card = game.aChooseCard(player, cards, { title: 'Choose a top card to transfer' })
      if (card) {
        game.aTransfer(player, card, game.getZoneByPlayer(leader, card.color))
      }
    }
  ],
}
