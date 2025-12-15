module.exports = {
  name: `Masquerade`,
  color: `purple`,
  age: 3,
  expansion: `usee`,
  biscuits: `cchk`,
  dogmaBiscuit: `c`,
  dogma: [
    `Safeguard an available achievement of value equal to the number of cards in your hand. If you do, return all cards of that value from your hand. If you return a {4}, claim the Anonymity achievement.`,
    `You may splay your purple cards left.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const handSize = game.zones.byPlayer(player, 'hand').cardlist().length
      const availableAchievement = game.getAvailableAchievementsByAge(player, handSize)[0]

      if (availableAchievement) {
        game.actions.safeguard(player, availableAchievement)

        const toReturn = game
          .cards
          .byPlayer(player, 'hand')
          .filter(c => c.getAge() === handSize)

        const returned = game.actions.returnMany(player, toReturn)

        if (returned.some(card => card.getAge() === game.getEffectAge(self, 4))) {
          game.actions.claimAchievement(player, game.cards.byId('Anonymity'))
        }
      }
    },
    (game, player) => {
      game.actions.chooseAndSplay(player, ['purple'], 'left')
    }
  ],
}
