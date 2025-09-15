module.exports = {
  name: `Horseshoes`,
  color: `red`,
  age: 2,
  expansion: `echo`,
  biscuits: `h2&k`,
  dogmaBiscuit: `k`,
  echo: `Draw and foreshadow a {2} or {3}.`,
  dogma: [
    `I demand you transfer a top card that has no {k} and no {f} from your board to my board! If you do, draw and meld a {2}.`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      const choices = game
        .cards.tops(player)
        .filter(card => !card.checkHasBiscuit('k') && !card.checkHasBiscuit('f'))
      const card = game.actions.chooseCard(player, choices)

      if (card) {
        const transferred = game.actions.transfer(player, card, game.zones.byPlayer(leader, card.color))
        if (transferred) {
          game.actions.drawAndMeld(player, game.getEffectAge(self, 2))
        }
      }
    }
  ],
  echoImpl: (game, player, { self }) => {
    const age = game.actions.chooseAge(player, [game.getEffectAge(self, 2), game.getEffectAge(self, 3)])
    game.actions.drawAndForeshadow(player, age)
  },
}
