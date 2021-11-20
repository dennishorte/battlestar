const { transitionFactory } = require('./factory.js')

module.exports = transitionFactory(
  {},
  generateOptions,
  handleResponse,
)

function generateOptions(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)

  // If all the vipers are launched, the player can choose an existing viper to "relaunch"
  if (game.getZoneByName('ships.vipers').cards.length === 0) {
    // Get the locations of all launched vipers.
    const launched = []
    for (let i = 0; i < 6; i++) {
      const zone = game.getZoneByName('space.space' + i)
      const hasVipers = !!zone.cards.find(c => c.kind = 'ships.vipers')
      if (hasVipers) {
        launched.push('space.space' + i)
      }
    }

    // If all of the vipers are damaged or destroyed, this should not have been allowed.
    if (launched.length === 0) {
      throw new Error("All vipers are damaged or destroyed. Can't launch")
    }

    context.wait({
      actor: player.name,
      actions: [
        {
          name: 'Relaunch Viper',
          count: 2,
          options: [
            {
              name: 'Recall from',
              options: launched,
            },
            {
              name: 'Launch to',
              options: ['Lower Left', 'Lower Right'],
            },
          ]
        }
      ]
    })
  }

  // Wait for the player to choose
  else {
    context.wait({
      actor: player.name,
      actions: [
        {
          name: 'Launch Self in Viper',
          options: [
            'Lower Left',
            'Lower Right',
          ],
        },
      ]
    })
  }
}


function handleResponse(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)
  const selection = context.response
  const validActionNames = ['Relaunch Viper', 'Launch Self in Viper']

  if (!validActionNames.includes(selection.name)) {
    throw new Error(`Unexpected action: ${selection.name}`)
  }

  // First, recall a viper if needed
  if (selection.name === 'Relaunch Viper') {
    const recallOption = selection.option.find(o => o.name === 'Recall from').option[0]
    const launchOption = selection.option.find(o => o.name === 'Launch to').option[0]
    const spaceIndex = parseInt(recallOption.slice(-1))

    game.mReturnViperFromSpaceZone(spaceIndex)
    game.aLaunchSelfInViper(player, launchOption)

    return context.done()
  }

  // Just launch the viper
  else {
    game.aLaunchSelfInViper(player, selection.option[0])
    return context.done()
  }
}
