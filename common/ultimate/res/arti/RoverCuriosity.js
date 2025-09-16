module.exports = {
  name: `Rover Curiosity`,
  color: `blue`,
  age: 10,
  expansion: `arti`,
  biscuits: `hsss`,
  dogmaBiscuit: `s`,
  dogma: [
    `Draw and meld an Artifact {0}. Execute each of the effects of the melded card as if they were on this card. Do not share them.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const card = game.aDrawAndMeld(player, game.getEffectAge(self, 10), { exp: 'arti' })
      if (card) {
        game.aExecuteAsIf(player, card)
      }
    }
  ],
}
