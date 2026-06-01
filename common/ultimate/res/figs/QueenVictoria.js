module.exports = {
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
          const pick = game.actions.choose(player, [
            game.actions.option({ id: 'score', title: 'score it' }),
            game.actions.option({ id: 'transfer', title: 'transfer it to the avaiable achievements' }),
          ])[0]
          const action = (pick && typeof pick === 'object') ? pick.id : pick

          if (action === 'score' || action === 'score it') {
            game.actions.score(player, chosenCard)
          }
          else {
            game.actions.transfer(player, chosenCard, game.zones.byId('achievements'))
          }
        }
      }
    }
  ]
}
