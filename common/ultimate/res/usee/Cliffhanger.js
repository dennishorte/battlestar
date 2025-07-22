const util = require('../../../lib/util.js')

module.exports = {
  name: `Cliffhanger`,
  color: `green`,
  age: 3,
  expansion: `usee`,
  biscuits: `sllh`,
  dogmaBiscuit: `l`,
  dogma: [
    `Reveal a {4} in your safe. If it is: green, tuck it; purple, meld it; red, achieve it regardless of eligibility; yellow, score it; blue, draw a {5}. Otherwise, safeguard the top card of the {4} deck.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const choices = game
        .cards.byPlayer(player, 'safe')
        .filter(card => card.age === 4)

      if (choices.length === 0) {
        const age = game.getEffectAge(self, 4)
        game.log.add({
          template: 'No cards of age {4} in safe; safeguarding top of {age} pile',
          args: { age }
        })

        const topCard = game.getZoneByDeck('base', 4).cards()[0]

        if (topCard) {
          game.aSafeguard(player, topCard)
        }
        else {
          game.log.add({ template: 'No cards in the 4 deck. (This is not a draw action.)' })
        }
        return
      }

      const card = util.array.select(choices)
      game.actions.reveal(player, card)

      switch (card.color) {
        case 'green':
          game.aTuck(player, card)
          break
        case 'purple':
          game.aMeld(player, card)
          break
        case 'red':
          game.actions.claimAchievement(player, card)
          break
        case 'yellow':
          game.aScore(player, card)
          break
        case 'blue':
          game.aDraw(player, { age: game.getEffectAge(self, 5) })
          break
        default:
          break
      }
    },
  ],
}
