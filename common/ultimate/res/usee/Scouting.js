module.exports = {
  name: `Scouting`,
  color: `blue`,
  age: 8,
  expansion: `usee`,
  biscuits: `lssh`,
  dogmaBiscuit: `s`,
  dogma: [
    `Draw and reveal two {9}. Return at least one of the drawn cards. If you return two, draw and reveal a {0}. If the color of the revealed card matches the color of at least one of the returned cards, keep it. Otherwise, put it back on top of its deck.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const cardsDrawn = [
        game.aDrawAndReveal(player, game.getEffectAge(self, 9)),
        game.aDrawAndReveal(player, game.getEffectAge(self, 9)),
      ].filter(x => x !== undefined)

      const returned = game.aChooseAndReturn(player, cardsDrawn, { min: 1, max: 2 })

      if (returned.length === 2) {
        const card = game.aDrawAndReveal(player, game.getEffectAge(self, 10))
        if (cardsDrawn.find(c => c.color === card.color)) {
          game.log.add({
            template: '{player} keeps the card',
            args: { player }
          })
        }
        else {
          game.mMoveCardToTop(card, game.getZoneByCardHome(card), { player })
        }
      }
    },
  ],
}
