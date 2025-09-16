module.exports = {
  name: `Buttonwood Agreement`,
  color: `green`,
  age: 6,
  expansion: `arti`,
  biscuits: `fcfh`,
  dogmaBiscuit: `f`,
  dogma: [
    `Choose three colors. Draw and reveal a {8}. If the drawn card is one of the chosen colors, score it and splay up that color. Otherwise, return all cards of the drawn card's color from your score pile, and unsplay that color.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const colors = game.aChoose(player, game.utilColors(), { count: 3 })
      const card = game.aDrawAndReveal(player, game.getEffectAge(self, 8))

      if (colors.includes(card.color)) {
        game.aScore(player, card)
        game.aSplay(player, card.color, 'up')
      }
      else {
        const toReturn = game
          .getCardsByZone(player, 'score')
          .filter(other => other.color === card.color)
        game.aReturnMany(player, toReturn)
        game.aUnsplay(player, card.color)
      }
    }
  ],
}
