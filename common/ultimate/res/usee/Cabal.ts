import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Cabal`,
  color: `red`,
  age: 5,
  expansion: `usee`,
  biscuits: `hffc`,
  dogmaBiscuit: `f`,
  dogma: [
    `I demand you transfer all cards from your hand that have a value matching any of my secrets to my score pile! Draw a {5}!`,
    `Safeguard an available achievement of value equal to a top card on your board.`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      const leaderSecretAges = game
        .cards.byPlayer(leader, 'safe')
        .map(card => card.getAge())

      const handCards = game
        .cards.byPlayer(player, 'hand')
        .filter(card => leaderSecretAges.includes(card.getAge()))

      game.actions.transferMany(player, handCards, game.zones.byPlayer(leader, 'score'))

      game.actions.draw(player, { age: game.getEffectAge(self, 5) })
    },

    (game, player) => {
      const topCardAges = game
        .cards.tops(player)
        .map(card => card.getAge())

      const availableAchievements = game
        .getAvailableStandardAchievements(player)
        .filter(achievement => topCardAges.includes(achievement.getAge()))

      game.actions.chooseAndSafeguard(player, availableAchievements, { hidden: true })
    }

  ],
} satisfies AgeCardData
