module.exports = {
  name: `Software`,
  color: `blue`,
  age: 10,
  expansion: `base`,
  biscuits: `ipih`,
  dogmaBiscuit: `i`,
  dogma: [
    `Draw and score a {0}.`,
    `Draw and meld two {9}, then self-execute the second card.`,
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      game.actions.drawAndScore(player, game.getEffectAge(self, 10))
    },
    (game, player, { self }) => {
      game.actions.drawAndMeld(player, game.getEffectAge(self, 9))
      const card = game.actions.drawAndMeld(player, game.getEffectAge(self, 9))
      game.log.add({
        template: '{player} will execute {card}',
        args: { player, card }
      })
      game.aCardEffects(player, card, 'dogma')
    },
  ],
}
