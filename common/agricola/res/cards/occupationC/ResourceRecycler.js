module.exports = {
  id: "resource-recycler-c149",
  name: "Resource Recycler",
  deck: "occupationC",
  number: 149,
  type: "occupation",
  players: "3+",
  text: "Each time another player renovates to stone, if you live in a clay house, you can pay 2 food to build a clay room at no additional cost.",
  onAnyRenovate(game, actingPlayer, cardOwner, { newType }) {
    if (newType === 'stone' && actingPlayer.name !== cardOwner.name && cardOwner.roomType === 'clay' && cardOwner.food >= 2) {
      const selection = game.actions.choose(cardOwner, () => [
        'Pay 2 food to build a free clay room',
        'Skip',
      ], { title: 'Resource Recycler', min: 1, max: 1 })
      if (selection[0] !== 'Skip') {
        cardOwner.payCost({ food: 2 })
        game.actions.buildRoom(cardOwner, { costOverride: {} })
        game.log.add({
          template: '{player} builds a free clay room via Resource Recycler',
          args: { player: cardOwner },
        })
      }
    }
  },
}
