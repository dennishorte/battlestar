
const util = require('../../../lib/util.js')

module.exports = {
  name: `Elevator`,
  color: `yellow`,
  age: 7,
  expansion: `echo`,
  biscuits: `7&ih`,
  dogmaBiscuit: `i`,
  echo: `Score your top or bottom green card.`,
  dogma: [
    `Choose a value present in your score pile. Choose to transfer all cards of the chosen value from either all other players' hands or all their score piles to your score pile.`
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = game
        .cards.byPlayer(player, 'score')
        .map(card => card.getAge())
      const distinct = util.array.distinct(choices).sort()
      const age = game.actions.chooseAge(player, distinct)
      if (age) {
        game.mLog({
          template: '{player} chooses {age}',
          args: { player, age }
        })
        const location = game.actions.choose(player, ['from scores', 'from hands'])[0]
        game.mLog({
          template: '{player} chooses {location}',
          args: { player, location }
        })

        const otherPlayers = game
          .getPlayerAll()
          .filter(other => other !== player)
        let cards
        if (location === 'from scores') {
          cards = otherPlayers
            .flatMap(player => game.cards.byPlayer(player, 'score'))
        }
        else {
          cards = otherPlayers
            .flatMap(player => game.cards.byPlayer(player, 'hand'))
        }

        cards = cards.filter(card => card.getAge() === age)

        game.actions.transferMany(player, cards, game.zones.byPlayer(player, 'score'))
      }
    }
  ],
  echoImpl: (game, player) => {
    const green = game.cards.byPlayer(player, 'green')
    if (green.length === 0) {
      game.log.addNoEffect()
    }
    else if (green.length === 1) {
      game.aScore(player, green[0])
    }
    else {
      const topOrBottom = game.actions.choose(player, ['score top green', 'score bottom green'])[0]
      if (topOrBottom === 'score top green') {
        game.aScore(player, green[0])
      }
      else {
        game.aScore(player, green[green.length - 1])
      }
    }
  },
}
