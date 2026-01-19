export default {
  name: `Jedlik's Electromagnetic Self-Rotor`,
  color: `red`,
  age: 7,
  expansion: `arti`,
  biscuits: `hiss`,
  dogmaBiscuit: `s`,
  dogma: [
    `Draw and score an {8}.`,
    `Draw and meld an {8}. If it is an {8}, choose a value, and junk all cards in the deck of that value.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      game.actions.drawAndScore(player, game.getEffectAge(self, 8))
    },

    (game, player, { self }) => {
      const melded = game.actions.drawAndMeld(player, game.getEffectAge(self, 8))

      if (melded.getAge() === 8) {
        const value = game.actions.chooseAge(player)
        game.actions.junkDeck(player, value)
      }
    }
  ],
}
