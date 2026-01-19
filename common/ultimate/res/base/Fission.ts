import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Fission`,
  color: `red`,
  age: 9,
  expansion: `base`,
  biscuits: `hiii`,
  dogmaBiscuit: `i`,
  dogma: [
    `I demand you draw and reveal a {0}! If it is red, junk all players' non-achievement cards, and the Dogma action is complete!`,
    `Return a top card other than Fission from any player's board. Draw a {0}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const card = game.actions.drawAndReveal(player, game.getEffectAge(self, 10))
      if (card.color === 'red') {
        game.log.add({ template: 'The card was red. Nuclear War!' })
        game.log.indent()

        const zones = ['red', 'yellow', 'green', 'blue', 'purple', 'hand', 'score', 'forecast', 'museum', 'safe']
        const toRemove = game
          .players.all()
          .flatMap(player => zones.flatMap(name => game.cards.byPlayer(player, name)))
        game.actions.junkMany(player, toRemove, { ordered: true })
        game.log.outdent()

        game.state.dogmaInfo.earlyTerminate = true
        return
      }

      else {
        game.log.add({ template: 'The card was not red.' })
      }
    },

    (game, player, { self }) => {
      game.actions.chooseAndReturn(player, game.cards.topsAll())
      game.actions.draw(player, { age: game.getEffectAge(self, 10) })
    }
  ],
} satisfies AgeCardData
