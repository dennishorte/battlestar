module.exports = {
  name: `Submarine H. L. Hunley`,
  color: `red`,
  age: 7,
  expansion: `arti`,
  biscuits: `fffh`,
  dogmaBiscuit: `f`,
  dogma: [
    `I compel you to draw and meld a {7}! Reveal the bottom card on your board of the melded card's color! If the revealed card is even-valued, return all cards of its color from your board!`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const card = game.actions.drawAndMeld(player, game.getEffectAge(self, 7))
      if (card) {
        const bottom = game.cards.bottom(player, card.color)
        if (bottom.getAge() % 2 === 0) {
          game.log.add({ template: 'Bottom card is even-valued.' })
          game.actions.returnMany(player, game.cards.byPlayer(player, card.color), { ordered: true })
        }
        else {
          game.log.add({ template: 'Bottom card is odd-valued.' })
        }
      }
    }
  ],
}
