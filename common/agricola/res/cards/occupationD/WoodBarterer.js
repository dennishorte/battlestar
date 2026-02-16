module.exports = {
  id: "wood-barterer-d119",
  name: "Wood Barterer",
  deck: "occupationD",
  number: 119,
  type: "occupation",
  players: "1+",
  text: "Each time before you use an action space with a \"Build Fences\" or \"Build Rooms\" action, you can choose to either get 2 wood or exchange up to 2 wood for 1 reed each.",
  onBeforeAction(game, player, actionId) {
    const buildActions = ['build-room-stable', 'fencing', 'renovation-fencing']
    if (!buildActions.includes(actionId)) {
      return
    }
    const choices = ['Get 2 wood']
    if (player.wood >= 1) {
      choices.push('Exchange 1 wood for 1 reed')
    }
    if (player.wood >= 2) {
      choices.push('Exchange 2 wood for 2 reed')
    }
    choices.push('Skip')
    const selection = game.actions.choose(player, choices, {
      title: 'Wood Barterer',
      min: 1,
      max: 1,
    })
    if (selection[0] === 'Get 2 wood') {
      player.addResource('wood', 2)
      game.log.add({
        template: '{player} gets 2 wood (Wood Barterer)',
        args: { player },
      })
    }
    else if (selection[0] === 'Exchange 1 wood for 1 reed') {
      player.wood -= 1
      player.addResource('reed', 1)
      game.log.add({
        template: '{player} exchanges 1 wood for 1 reed (Wood Barterer)',
        args: { player },
      })
    }
    else if (selection[0] === 'Exchange 2 wood for 2 reed') {
      player.wood -= 2
      player.addResource('reed', 2)
      game.log.add({
        template: '{player} exchanges 2 wood for 2 reed (Wood Barterer)',
        args: { player },
      })
    }
  },
}
