import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Meteorology`,
  color: `blue`,
  age: 2,
  expansion: `usee`,
  biscuits: `sslh`,
  dogmaBiscuit: `s`,
  dogma: [
    `Draw and reveal a {3}. If it has {l}, score it. Otherwise, if it has {c}, return it and draw two {3}. Otherwise, tuck it.`,
    `If you have no {k}, claim the Zen achievement.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const card = game.actions.drawAndReveal(player, game.getEffectAge(self, 3))
      if (card.checkHasBiscuit('l')) {
        game.actions.score(player, card)
      }

      else if (card.checkHasBiscuit('c')) {
        game.actions.return(player, card)
        game.actions.draw(player, { age: game.getEffectAge(self, 3) })
        game.actions.draw(player, { age: game.getEffectAge(self, 3) })
      }
      else {
        game.actions.tuck(player, card)
      }
    },
    (game, player) => {
      const biscuits = player.biscuits()
      if (biscuits.k === 0) {
        game.actions.claimAchievement(player, { name: 'Zen' })
      }
      else {
        game.log.addNoEffect()
      }
    }
  ],
} satisfies AgeCardData
