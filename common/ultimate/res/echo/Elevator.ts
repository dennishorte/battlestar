import util from '../../../lib/util.js'
import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Elevator`,
  color: `yellow`,
  age: 7,
  expansion: `echo`,
  biscuits: `7&ih`,
  dogmaBiscuit: `i`,
  echo: `Score your top or bottom green card.`,
  dogma: [
    `Choose a value present in your score pile. Choose to score all the cards of the chosen value in either all opponents' hands or all their score piles. Draw and foreshadow a card of the chosen value.`
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = game
        .cards
        .byPlayer(player, 'score')
        .map(card => card.getAge())
      const distinct = util.array.distinct(choices).sort()
      const age = game.actions.chooseAge(player, distinct)

      if (!age) {
        game.log.add({
          template: '{player} has no cards in their score pile',
          args: { player },
        })
      }

      else {
        game.log.add({
          template: '{player} chooses {age}',
          args: { player, age }
        })
        const location = game.actions.choose(player, ['from scores', 'from hands'])[0]
        game.log.add({
          template: '{player} chooses {location}',
          args: { player, location }
        })

        const zoneName = location === 'from scores' ? 'score' : 'hand'
        const otherPlayers = game.players.other(player)
        const cards = otherPlayers
          .flatMap(other => game.cards.byPlayer(other, zoneName))
          .filter(card => card.getAge() === age)

        game.actions.scoreMany(player, cards, game.zones.byPlayer(player, 'score'))

        game.actions.drawAndForeshadow(player, age)
      }
    }
  ],
  echoImpl: (game, player) => {
    const green = game.cards.byPlayer(player, 'green')
    if (green.length === 0) {
      game.log.addNoEffect()
    }
    else if (green.length === 1) {
      game.actions.score(player, green[0])
    }
    else {
      const topOrBottom = game.actions.choose(player, ['score top green', 'score bottom green'])[0]
      if (topOrBottom === 'score top green') {
        game.actions.score(player, green[0])
      }
      else {
        game.actions.score(player, green[green.length - 1])
      }
    }
  },
} satisfies AgeCardData
