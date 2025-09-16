module.exports = {
  name: `DeLorean DMC-12`,
  color: `purple`,
  age: 10,
  expansion: `arti`,
  biscuits: `hiii`,
  dogmaBiscuit: `i`,
  dogma: [
    `If DeLorean DMC-12 is a top card on any board, remove all top cards on all boards and all cards in all hands from the game.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      if (game.checkCardIsTop(self) && !self.zone.endsWith('.artifact')) {
        const topCards = game
          .getPlayerAll()
          .flatMap(player => game.getTopCards(player))
        game.aRemoveMany(player, topCards)

        const hands = game
          .getPlayerAll()
          .flatMap(player => game.getCardsByZone(player, 'hand'))
        game.aRemoveMany(player, hands, { ordered: true })
      }
      else {
        game.mLogNoEffect()
      }
    }
  ],
}
