module.exports = {
  name: `Octant`,
  color: `red`,
  age: 5,
  expansion: `echo`,
  biscuits: `cchc`,
  dogmaBiscuit: `c`,
  echo: ``,
  dogma: [
    `I demand you transfer a top non-red card with a {l} or {f} from your board to my board! If you do, draw and foreshadow a {6}!`,
    `Draw and foreshadow a {6}.`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      const choices = game
        .cards.tops(player)
        .filter(card => card.color !== 'red')
        .filter(card => card.checkHasBiscuit('l') || card.checkHasBiscuit('f'))
      const card = game.actions.chooseCard(player, choices, { title: 'Choose a card to transfer' })
      if (card) {
        const transferred = game.actions.transfer(player, card, game.zones.byPlayer(leader, card.color))
        if (transferred) {
          game.actions.drawAndForeshadow(player, game.getEffectAge(self, 6))
        }
      }
    },

    (game, player, { self }) => {
      game.actions.drawAndForeshadow(player, game.getEffectAge(self, 6))
    },
  ],
  echoImpl: [],
}
