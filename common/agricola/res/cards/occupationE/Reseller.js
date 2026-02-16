module.exports = {
  id: "reseller-e146",
  name: "Reseller",
  deck: "occupationE",
  number: 146,
  type: "occupation",
  players: "1+",
  text: "Once this game, immediately after playing or building an improvement, you can choose to get its printed cost from the general supply.",
  onPlay(game, _player) {
    game.cardState(this.id).used = false
  },
  onBuildImprovement(game, player, _cost, improvement) {
    if (game.cardState(this.id).used) {
      return
    }
    const printedCost = improvement.cost
    if (!printedCost) {
      return
    }

    const costStr = Object.entries(printedCost).map(([r, n]) => `${n} ${r}`).join(', ')
    const selection = game.actions.choose(player, [`Get ${costStr} from supply`, 'Skip'], {
      title: 'Reseller: Refund improvement cost?',
      min: 1,
      max: 1,
    })
    if (selection[0] !== 'Skip') {
      for (const [resource, amount] of Object.entries(printedCost)) {
        player.addResource(resource, amount)
      }
      game.cardState(this.id).used = true
      game.log.add({
        template: '{player} gets {cost} from Reseller',
        args: { player, cost: costStr },
      })
    }
  },
}
