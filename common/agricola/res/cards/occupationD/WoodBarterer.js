module.exports = {
  id: "wood-barterer-d119",
  name: "Wood Barterer",
  deck: "occupationD",
  number: 119,
  type: "occupation",
  players: "1+",
  text: "Each time before you use an action space with a \"Build Fences\" or \"Build Rooms\" action, you can choose to either get 2 wood or exchange up to 2 wood for 1 reed each.",
  matches_onBeforeAction(_game, _player, actionId) {
    const buildActions = ['build-room-stable', 'fencing', 'renovation-fencing']
    return buildActions.includes(actionId)
  },
  onBeforeAction(game, player, _actionId) {
    const choices = [game.actions.option({ id: 'gain', title: 'Get 2 wood' })]
    if (player.wood >= 1) {
      choices.push(game.actions.option({ id: 'exchange-1', title: 'Exchange 1 wood for 1 reed' }))
    }
    if (player.wood >= 2) {
      choices.push(game.actions.option({ id: 'exchange-2', title: 'Exchange 2 wood for 2 reed' }))
    }
    choices.push(game.actions.option({ id: 'skip', title: 'Skip' }))
    const selection = game.actions.choose(player, choices, {
      title: 'Wood Barterer',
      min: 1,
      max: 1,
    })
    if (selection[0].id === 'gain') {
      player.addResource('wood', 2)
      game.log.add({
        template: '{player} gets 2 wood',
        args: { player },
      })
    }
    else if (selection[0].id === 'exchange-1') {
      player.removeResource('wood', 1)
      player.addResource('reed', 1)
      game.log.add({
        template: '{player} exchanges 1 wood for 1 reed',
        args: { player },
      })
    }
    else if (selection[0].id === 'exchange-2') {
      player.removeResource('wood', 2)
      player.addResource('reed', 2)
      game.log.add({
        template: '{player} exchanges 2 wood for 2 reed',
        args: { player },
      })
    }
  },
}
