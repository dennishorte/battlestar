module.exports = {
  id: "lasso-b024",
  name: "Lasso",
  deck: "minorB",
  number: 24,
  type: "minor",
  cost: { reed: 1 },
  category: "Actions Booster",
  text: "You can place exactly two people immediately after one another if at least one of them uses the \"Sheep Market\", \"Pig Market\", or \"Cattle Market\" accumulation space.",
  allowDoubleWorkerPlacement: ["take-sheep", "take-boar", "take-cattle"],

  afterPlayerAction(game, player, actionId) {
    const animalMarketActions = this.allowDoubleWorkerPlacement
    const isAnimalMarket = animalMarketActions.includes(actionId)

    if (player.getAvailableWorkers() <= 0) {
      return
    }

    let allowedActions
    if (isAnimalMarket) {
      // Took animal market — second action can be anything
      const available = game.getAvailableActions(player)
      if (available.length === 0) {
        return
      }
    }
    else {
      // Took non-animal-market — second action must be animal market
      const available = game.getAvailableActions(player)
      const valid = available.filter(id => animalMarketActions.includes(id))
      if (valid.length === 0) {
        return
      }
      allowedActions = valid
    }

    const choices = ['Use Lasso', 'Skip']
    const selection = game.actions.choose(player, choices, {
      title: 'Lasso: Place a second person?',
      min: 1,
      max: 1,
    })

    if (selection[0] === 'Use Lasso') {
      game.log.add({
        template: '{player} uses Lasso to place a second person',
        args: { player },
      })
      game.log.indent()
      game.playerTurn(player, { isBonusTurn: true, allowedActions })
      game.log.outdent()
    }
  },
}
