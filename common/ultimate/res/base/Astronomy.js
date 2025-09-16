module.exports = {
  name: `Astronomy`,
  color: `purple`,
  age: 5,
  expansion: `base`,
  biscuits: `cssh`,
  dogmaBiscuit: `s`,
  dogma: [
    `Draw and reveal a {6}. If the card is green or blue, meld it and repeat this dogma effect.`,
    `If all non-purple top cards on your board are value {6} or higher, claim the Universe achievement.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      while (true) {
        const card = game.actions.drawAndReveal(player, game.getEffectAge(self, 6))
        if (card) {
          if (card.color === 'green' || card.color === 'blue') {
            game.actions.meld(player, card)
            game.log.add({ template: 'dogma effect repeats' })
          }
          else {
            break
          }
        }
      }
    },

    (game, player) => {
      const conditionMet = game
        .util.colors()
        .filter(color => color !== 'purple')
        .map(color => game.cards.top(player, color))
        .filter(card => card !== undefined)
        .every(card => card.getAge() >= 6)

      if (conditionMet) {
        game.actions.claimAchievement(player, { name: 'Universe' })
      }
      else {
        game.log.addNoEffect()
      }
    }
  ],
}
