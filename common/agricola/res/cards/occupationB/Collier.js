module.exports = {
  id: "collier-b144",
  name: "Collier",
  deck: "occupationB",
  number: 144,
  type: "occupation",
  players: "3+",
  text: "Each time after you use the \"Clay Pit\" accumulation space, you get 1 reed and 1 wood. With 3 or more players, you get 1 additional wood on the \"Hollow\" accumulation space.",
  onAction(game, player, actionId) {
    if (actionId === 'take-clay') {
      player.addResource('reed', 1)
      player.addResource('wood', 1)
      game.log.add({
        template: '{player} gets 1 reed and 1 wood from Collier',
        args: { player },
      })
      if (game.players.all().length >= 3) {
        // Add 1 wood to Hollow accumulation space
        const hollowIds = ['hollow', 'hollow-5', 'hollow-6']
        for (const hollowId of hollowIds) {
          const hollowState = game.state.actionSpaces[hollowId]
          if (hollowState && hollowState.accumulated != null) {
            hollowState.accumulated += 1
            game.log.add({
              template: '{player} places 1 wood on Hollow via Collier',
              args: { player },
            })
            break
          }
        }
      }
    }
  },
}
