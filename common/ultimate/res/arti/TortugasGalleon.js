module.exports = {
  name: `Tortugas Galleon`,
  color: `red`,
  age: 4,
  expansion: `arti`,
  biscuits: `ffch`,
  dogmaBiscuit: `f`,
  dogma: [
    `I compel you to transfer all the highest cards from your score pile to my score pile! If you transfered any, transfer a top card on your board of that value to my board.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const highest = game.utilHighestCards(game.getCardsByZone(player, 'score'))
      const transferred = game.aTransferMany(player, highest, game.getZoneByPlayer(leader, 'score'))
      if (transferred && transferred.length > 0) {
        const age = transferred[0].getAge()
        const choices = game
          .getTopCards(player)
          .filter(card => card.getAge() === age)
        const card = game.actions.chooseCard(player, choices)
        if (card) {
          game.aTransfer(player, card, game.getZoneByPlayer(leader, card.color))
        }
      }
    }
  ],
}
