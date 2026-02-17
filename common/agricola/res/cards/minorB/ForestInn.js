module.exports = {
  id: "forest-inn-b042",
  name: "Forest Inn",
  deck: "minorB",
  number: 42,
  type: "minor",
  cost: { clay: 1, reed: 1 },
  vps: 1,
  prereqs: { maxRound: 6 },
  category: "Actions Booster",
  text: "This is an action space for all. A player who uses it can exchange 5/7/9 wood for 8 wood and 2/4/7 food. When another player uses it, they must first pay you 1 food.",
  providesActionSpace: true,
  actionSpaceId: "forest-inn",
  onActionSpaceUsed(game, actingPlayer, cardOwner) {
    if (actingPlayer.name !== cardOwner.name) {
      if (actingPlayer.food >= 1) {
        actingPlayer.payCost({ food: 1 })
        cardOwner.addResource('food', 1)
        game.log.add({
          template: '{actingPlayer} pays 1 food to {owner} to use Forest Inn',
          args: { actingPlayer, owner: cardOwner },
        })
      }
    }
    const card = this
    const tiers = [
      { cost: 5, food: 2 },
      { cost: 7, food: 4 },
      { cost: 9, food: 7 },
    ]

    const affordable = tiers.filter(t => actingPlayer.wood >= t.cost)
    if (affordable.length === 0) {
      return
    }

    const choices = affordable.map(t =>
      `Exchange ${t.cost} wood for 8 wood and ${t.food} food`
    )
    choices.push('Skip')

    const selection = game.actions.choose(actingPlayer, choices, {
      title: `${card.name}: Exchange wood?`,
      min: 1,
      max: 1,
    })

    if (selection[0] !== 'Skip') {
      const tier = affordable.find(t =>
        selection[0] === `Exchange ${t.cost} wood for 8 wood and ${t.food} food`
      )
      actingPlayer.payCost({ wood: tier.cost })
      actingPlayer.addResource('wood', 8)
      actingPlayer.addResource('food', tier.food)
      game.log.add({
        template: '{player} exchanges {cost} wood for 8 wood and {food} food at Forest Inn',
        args: { player: actingPlayer, cost: tier.cost, food: tier.food },
      })
    }
  },
}
