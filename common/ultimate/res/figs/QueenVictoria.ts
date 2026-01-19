import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `Queen Victoria`,  // Card names are unique in Innovation
  name: `Queen Victoria`,
  color: `purple`,
  age: 7,
  expansion: `figs`,
  biscuits: `ssph`,
  dogmaBiscuit: `s`,
  karma: [
    `You may issue a Rivalry Decree with any two figures.`,
    `If you would score a card, first choose a figure in any score pile. Choose to either score it or transfer it to the available achievements.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Rivalry',
    },
    {
      trigger: 'score',
      kind: 'would-first',
      matches: () => true,
      func: (game, player) => {
        const options = game
          .players
          .all()
          .flatMap(p => game.cards.byPlayer(p, 'score'))
          .filter(card => card.checkIsFigure())

        const chosenCard = game.actions.chooseCard(player, options)

        if (chosenCard) {
          const action = game.actions.choose(player, ['score it', 'transfer it to the avaiable achievements'])[0]

          if (action === 'score it') {
            game.actions.score(player, chosenCard)
          }

          else {
            game.actions.transfer(player, chosenCard, game.zones.byId('achievements'))
          }
        }
      }
    }
  ]
} satisfies AgeCardData
