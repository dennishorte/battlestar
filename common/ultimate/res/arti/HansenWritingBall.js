module.exports = {
  name: `Hansen Writing Ball`,
  color: `green`,
  age: 7,
  expansion: `arti`,
  biscuits: `ilih`,
  dogmaBiscuit: `i`,
  dogma: [
    `I compel you to draw four {7}! Meld a blue card, then transfer all cards in your hand to my hand!`,
    `Draw and reveal a {7}. If it has no {i}, tuck it and repeat this effect.`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      for (let i = 0; i < 4; i++) {
        game.actions.draw(player, { age: game.getEffectAge(self, 7) })
      }

      const choices = game
        .getCardsByZone(player, 'hand')
        .filter(card => card.color === 'blue')

      game.actions.chooseAndMeld(player, choices)

      game.actions.transferMany(
        player,
        game.getCardsByZone(player, 'hand'),
        game.zones.byPlayer(leader, 'hand'),
        { ordered: true },
      )
    },

    (game, player, { self }) => {
      while (true) {
        const card = game.actions.drawAndReveal(player, game.getEffectAge(self, 7))
        if (card) {
          if (card.checkHasBiscuit('i')) {
            game.log.add({ template: 'Card has a {i} biscuit' })
            break
          }
          else {
            game.log.add({ template: 'Card does not have a {i} biscuit' })
            game.actions.tuck(player, card)
          }
        }
      }
    },
  ],
}
