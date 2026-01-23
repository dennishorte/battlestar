const util = require('../../../lib/util.js')

module.exports = {
  name: `Barcode`,
  color: `green`,
  age: 10,
  expansion: `echo`,
  biscuits: `ffhf`,
  dogmaBiscuit: `f`,
  echo: ``,
  dogma: [
    `I demand you return a card of matching value from your score pile for each bonus on your board.`,
    `You may splay any one color of your cards up. If Barcode was foreseen, splay all your colors up.`,
  ],
  dogmaImpl: [
    (game, player) => {
      const bonuses = player.bonuses()
      while (bonuses.length > 0) {
        game.log.add({ template: bonuses.join(',') })
        const scoreCards = game
          .cards
          .byPlayer(player, 'score')
          .filter(card => bonuses.some(value => card.getAge() === value))

        if (scoreCards.length === 0) {
          return
        }

        const chosen = game.actions.chooseCard(player, scoreCards, {
          title: 'Choose a card to return next',
        })

        if (chosen) {
          util.array.remove(bonuses, chosen.getAge())
          game.actions.return(player, chosen)
        }
      }
    },

    (game, player, { foreseen, self }) => {
      game.log.addForeseen(foreseen, self)

      if (foreseen) {
        game.util.colors().forEach(color => game.actions.splay(player, color, 'up'))
      }
      else {
        game.actions.chooseAndSplay(player, null, 'up')
      }
    },
  ],
  echoImpl: [],
}
