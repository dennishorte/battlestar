const util = require('../../../lib/util.js')

module.exports = {
  name: `Jet`,
  color: `red`,
  age: 9,
  expansion: `echo`,
  biscuits: `h&ia`,
  dogmaBiscuit: `i`,
  echo: `Meld a card from your hand.`,
  dogma: [
    `I demand you return your top card of the color I last melded due to Jet's echo effect during this action. Junk all achievements of value equal to the melded card and the returned card.`,
    `Draw and foreshadow a {0}`,
  ],
  dogmaImpl: [
    (game, player) => {
      const valuesToJunk = []

      const melded = game.state.dogmaInfo.jet
      if (melded) {
        valuesToJunk.push(melded.getAge())
        const toReturn = game.cards.top(player, melded.color)
        if (toReturn) {
          const returned = game.actions.return(player, toReturn)
          if (returned) {
            valuesToJunk.push(returned.getAge())
          }
        }
        else {
          game.log.add({
            template: '{player} has no {color} top card',
            args: {
              player,
              color: melded.color
            }
          })
        }
      }

      else {
        game.log.add({
          template: 'No card was melded due to the echo effect.'
        })
      }

      const toJunk = util
        .array
        .distinct(valuesToJunk)
        .flatMap(age => game.getAvailableAchievementsByAge(player, age))

      game.actions.junkMany(player, toJunk, { ordered: true })
    },

    (game, player, { self }) => {
      game.actions.drawAndForeshadow(player, game.getEffectAge(self, 10))
    }
  ],
  echoImpl: (game, player, { self, leader }) => {
    if (!game.state.dogmaInfo.jet) {
      game.state.dogmaInfo.jet = ''
    }

    const cards = game.actions.chooseAndMeld(player, game.cards.byPlayer(player, 'hand'))
    if (player === leader && cards.length > 0) {
      game.state.dogmaInfo.jet = cards[0]
    }
  },
}
