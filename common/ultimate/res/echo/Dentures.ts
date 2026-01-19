import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Dentures`,
  color: `yellow`,
  age: 6,
  expansion: `echo`,
  biscuits: `&ffh`,
  dogmaBiscuit: `f`,
  echo: [`Draw and tuck a {6}.`],
  dogma: [
    `Score the top two non-bottom cards of the color of the last card you tucked due to Dentures. If there are none to score, draw and tuck a {6}, then repeat this dogma effect.`,
    `You may splay your blue cards right.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      if (!game.state.dogmaInfo.dentures) {
        game.log.add({
          template: "No cards scored with Dentures's echo effect"
        })
        return
      }

      let card = game.state.dogmaInfo.dentures[player.name]

      while (true) {
        if (card) {
          const cards = game.cards.byPlayer(player, card.color)
          game.log.add({
            template: '{player} will try to score {color}',
            args: { player, color: card.color }
          })

          if (cards.length === 1) {
            game.log.add({
              template: '{player} has no non-bottom {color} cards',
              args: { player, color: card.color }
            })
            card = game.actions.drawAndTuck(player, game.getEffectAge(self, 6))
            continue
          }
          if (cards.length > 1) {
            game.actions.score(player, cards[0])
          }
          if (cards.length > 2) {
            game.actions.score(player, cards[1])
          }
          break
        }
        else {
          game.log.addNoEffect()
          break
        }
      }
    },

    (game, player) => {
      game.actions.chooseAndSplay(player, ['blue'], 'right')
    }
  ],
  echoImpl: [
    (game, player, { self }) => {
      const card = game.actions.drawAndTuck(player, game.getEffectAge(self, 6))

      if (!game.state.dogmaInfo.dentures) {
        game.state.dogmaInfo.dentures = {}
      }

      game.state.dogmaInfo.dentures[player.name] = card
    }
  ],
} satisfies AgeCardData
