module.exports = {
  name: `Mjolnir Amulet`,
  color: `red`,
  age: 3,
  expansion: `arti`,
  biscuits: `hkks`,
  dogmaBiscuit: `k`,
  dogma: [
    `I compel you to choose a top card on your board! Transfer all cards of the card's color from your board to my score pile!`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const card = game.actions.chooseCard(player, game.getTopCards(player))
      if (card) {
        game.aTransferMany(
          player,
          game.getCardsByZone(player, card.color),
          game.getZoneByPlayer(leader, 'score'),
          { ordered: true },
        )
      }
      else {
        game.log.add({
          template: '{player} chooses nothing',
          args: { player }
        })
      }
    }
  ],
}
