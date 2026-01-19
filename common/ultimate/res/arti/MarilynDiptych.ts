import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Marilyn Diptych`,
  color: `purple`,
  age: 9,
  expansion: `arti`,
  biscuits: `ccch`,
  dogmaBiscuit: `c`,
  dogma: [
    `You may score a card from your hand. You may transfer any card from your score pile to your hand. If you have exactly 25 points, you win.`,
    `Junk an available standard achievement.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      game.actions.chooseAndScore(player, game.cards.byPlayer(player, 'hand'), { min: 0, max: 1 })
      game.actions.chooseAndTransfer(player, game.cards.byPlayer(player, 'score'), game.zones.byPlayer(player, 'hand'), { min: 0, max: 1 })

      if (game.getScore(player) === 25) {
        game.youWin(player, self.name)
      }

    },

    (game, player) => {
      game.actions.junkAvailableAchievement(player, game.getAges())
    },
  ],
} satisfies AgeCardData
