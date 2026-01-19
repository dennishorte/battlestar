import util from '../../../lib/util.js'

export default {
  id: `Alhazen`,  // Card names are unique in Innovation
  name: `Alhazen`,
  color: `blue`,
  age: 3,
  expansion: `figs`,
  biscuits: `ssph`,
  dogmaBiscuit: `s`,
  karma: [
    `If you would take a Draw action, instead tuck a top card with a {k} from anywhere. Then draw a card of value equal to the number of {k} or {s} in a color on your board.`
  ],
  karmaImpl: [
    {
      trigger: 'draw-action',
      kind: 'would-instead',
      matches: () => true,
      func: (game, player) => {
        const canTuck = game.cards.topsAll().filter(card => card.checkHasBiscuit('k'))
        game.actions.chooseAndTuck(player, canTuck)

        const ageChoices = game
          .util
          .colors()
          .map(color => game.zones.byPlayer(player, color))
          .flatMap(zone => {
            const biscuits = zone.biscuits()
            return [biscuits.s, biscuits.k]
          })
          .filter(age => age > 0) // Filter out 0 values
        const uniqueChoices = util
          .array
          .distinct(ageChoices)
          .sort((l, r) => l - r)
        const ageToDraw = game.actions.chooseAge(player, uniqueChoices, {
          title: 'Choose an age to draw',
        })
        game.actions.draw(player, { age: ageToDraw })
      },
    }
  ]
}
