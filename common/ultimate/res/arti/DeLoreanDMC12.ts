export default {
  name: `DeLorean DMC-12`,
  color: `purple`,
  age: 10,
  expansion: `arti`,
  biscuits: `hiii`,
  dogmaBiscuit: `i`,
  dogma: [
    `If DeLorean DMC-12 is a top card on any board, junk a top card of each color from each board and all cards in all hands.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      if (self.isTopCardStrict()) {
        const topCards = game
          .players
          .all()
          .flatMap(player => game.cards.tops(player))
        game.actions.junkMany(player, topCards)

        const hands = game
          .players
          .all()
          .flatMap(player => game.cards.byPlayer(player, 'hand'))
        game.actions.junkMany(player, hands, { ordered: true })
      }
      else {
        game.log.addNoEffect()
      }
    }
  ],
}
