module.exports = {
  id: "master-renovator-e087",
  name: "Master Renovator",
  deck: "occupationE",
  number: 87,
  type: "occupation",
  players: "1+",
  text: "At the end of the work phases of rounds 7 and 9, you can take a \"Renovation\" action without placing a person and pay 1 building resource of your choice less.",
  onWorkPhaseEnd(game, player) {
    if (game.state.round === 7 || game.state.round === 9) {
      // Give the player 1 extra building resource of choice to simulate discount
      // Then offer renovation. The extra resource offsets the cost.
      const canRenovateNormally = player.canRenovate()

      // Check if player could afford with 1 extra of any building resource
      const resources = ['clay', 'stone', 'reed']
      const affordableWith = []
      for (const res of resources) {
        player.addResource(res, 1)
        if (player.canRenovate()) {
          affordableWith.push(res)
        }
        player.removeResource(res, 1)
      }

      if (canRenovateNormally) {
        // Can afford without discount - still offer discount
        const choices = resources.filter(r => {
          // Only offer resources that are part of renovation cost
          const cost = player.getRenovationCost()
          return cost && cost[r] > 0
        }).map(r => `Get 1 free ${r}`)
        choices.push('No discount')

        const selection = game.actions.choose(player, choices, {
          title: 'Master Renovator: Choose discount resource',
          min: 1,
          max: 1,
        })

        if (selection[0] !== 'No discount') {
          const chosen = resources.find(r => selection[0] === `Get 1 free ${r}`)
          if (chosen) {
            player.addResource(chosen, 1)
          }
        }
        game.actions.renovate(player)
      }
      else if (affordableWith.length > 0) {
        // Can only afford with discount
        const choices = affordableWith.map(r => `Get 1 free ${r} and renovate`)
        choices.push('Skip')

        const selection = game.actions.choose(player, choices, {
          title: 'Master Renovator: Renovation with discount',
          min: 1,
          max: 1,
        })

        if (selection[0] !== 'Skip') {
          const chosen = resources.find(r => selection[0] === `Get 1 free ${r} and renovate`)
          if (chosen) {
            player.addResource(chosen, 1)
            game.actions.renovate(player)
          }
        }
      }
      // else: cannot afford even with discount, do nothing
    }
  },
}
