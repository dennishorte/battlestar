module.exports = {
  name: `Rover Curiosity`,
  color: `blue`,
  age: 10,
  expansion: `arti`,
  biscuits: `hsss`,
  dogmaBiscuit: `s`,
  dogma: [
    `Draw and meld an Artifact {0}, then self-execute it.`,
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const card = game.actions.drawAndMeld(player, game.getEffectAge(self, 10), { exp: 'arti' })
      if (card) {
        game.aSelfExecute(self, player, card)
      }
    }
  ],
}
