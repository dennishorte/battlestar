module.exports = {
  name: `Fertilizer`,
  color: `yellow`,
  age: 7,
  expansion: `echo`,
  biscuits: `lhfl`,
  dogmaBiscuit: `l`,
  echo: [],
  dogma: [
    `You may return a card from your hand. If you do, transfer all cards from all score piles to your hand of value equal to the returned card.`,
    `Draw and foreshadow a card of any value.`
  ],
  dogmaImpl: [
    (game, player) => {
      const cards = game.aChooseAndReturn(player, game.getCardsByZone(player, 'hand'), { min: 0, max: 1} )
      if (cards && cards.length > 0) {
        const age = cards[0].getAge()
        const toTransfer = game
          .getPlayerAll()
          .flatMap(player => game
            .getCardsByZone(player, 'score')
            .filter(card => card.getAge() === age)
          )
        game.aTransferMany(player, toTransfer, game.getZoneByPlayer(player, 'hand'))
      }
    },

    (game, player) => {
      const age = game.aChooseAge(player)
      game.aDrawAndForeshadow(player, age)
    }
  ],
  echoImpl: [],
}
