module.exports = launchSelfInViper




function launchSelfInViper(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)

  if (context.response) {
    const selection = context.response.option[0]
    throw new Error('not implemented')
  }

  // If all the vipers are launched, the player can choose an existing viper to "relaunch"
  else if (game.getZoneByName('ships.vipers').cards.length === 0) {
    // Get the locations of all launched vipers.
    const launched = []

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
            launched,
            ['Lower Left', 'Lower Right'],
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
