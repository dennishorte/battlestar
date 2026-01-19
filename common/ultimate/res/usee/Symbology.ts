import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Symbology`,
  color: `purple`,
  age: 1,
  expansion: `usee`,
  biscuits: `sshk`,
  dogmaBiscuit: `s`,
  dogma: [
    `If you have at least four each of at least four biscuit on your board, draw a {4}. Otherwise, if you have three of three biscuits, draw a {3}. Otherwise, if you have two of two biscuits, draw a {2}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const biscuits = player.biscuits()
      const biscuitCounts = [0, 0, 0, 0, 0]

      for (const count of Object.values(biscuits)) {
        if (count >= 4) {
          biscuitCounts[4] += 1
        }

        if (count >= 3) {
          biscuitCounts[3] += 1
        }
        if (count >= 2) {
          biscuitCounts[2] += 1
        }
      }

      game.log.add({ template: 'four biscuits: ' + biscuitCounts[4] })
      game.log.add({ template: 'three biscuits: ' + biscuitCounts[3] })
      game.log.add({ template: 'two biscuits: ' + biscuitCounts[2] })

      if (biscuitCounts[4] >= 4) {
        game.actions.draw(player, { age: game.getEffectAge(self, 4) })
      }
      else if (biscuitCounts[3] >= 3) {
        game.actions.draw(player, { age: game.getEffectAge(self, 3) })
      }
      else if (biscuitCounts[2] >= 2) {
        game.actions.draw(player, { age: game.getEffectAge(self, 2) })
      }
      else {
        game.log.addNoEffect()
      }
    },
  ],
} satisfies AgeCardData
