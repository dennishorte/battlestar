module.exports = playerTurnMovement


function playerTurnMovement(context) {
  _initialize(context)

  if (context.data.done) {
    return context.done()
  }

  else if (context.response) {
    return _handleResponse(context)
  }

  else {
    return _generateOptions(context)
  }
}

function _initialize(context) {
  const game = context.state

  if (context.data.initialized) {
    return
  }

  game.rk.sessionStart(session => {
    session.addKey(context.data, 'initialized', true)

    // True when the user has moved, but still needs to discard a card.
    session.addKey(context.data, 'done', false)
  })
}

function _handleResponse(context) {
  const game = context.state
  const player = game.getPlayerCurrentTurn()
  const selection = context.response.option[0]

  if (selection === 'Skip Movement') {
    game.rk.sessionStart(() => {
      game.mLog({
        template: "{player} decides not to move",
        args: {
          player: player.name
        }
      })
    })
    return context.done()
  }

  // Handle movement in space
  else if (selection.name === 'Move Viper') {
    const zone = game.getZoneByPlayerLocation(player)
    const viper = zone.cards.find(c => c.name === 'viper')
    const token = zone.cards.find(c => c.name === player.name && c.kind === 'player-token')
    const newZone = game.getZoneByName(selection.option)

    game.rk.sessionStart(session => {
      session.move(token, newZone.cards, newZone.cards.length)
      session.move(viper, newZone.cards, newZone.cards.length)
    })

    return context.done()
  }

  const playerZone = game.getZoneByPlayerLocation(player)
  const targetZone = game.getZoneByLocationName(selection.option)
  const sameShip = (
    !playerZone.name.startsWith('space')
    && playerZone.details.area === targetZone.details.area
  )

  game.rk.sessionStart(() => {
    game.mLog({
      template: "{player} moves to {location}",
      args: {
        player: player.name,
        location: targetZone.details.name,
      }
    })
    game.mMovePlayer(player, targetZone)

    if (playerZone.name.startsWith('space')) {
      game.mLog({
        template: 'Viper returned to supply',
      })
      game.mReturnViperFromSpaceZone(5)
    }
  })

  if (!sameShip) {
    return context.push('discard-skill-cards', {
      playerName: player.name,
      count: 1
    })
  }
  else {
    return context.done()
  }
}

function _generateOptions(context) {
  const game = context.state
  const player = game.getPlayerCurrentTurn()

  // If the player is in the brig, they don't get to move
  if (game.checkPlayerIsAtLocation(player, 'Brig')) {
    game.rk.sessionStart(() => {
      game.mLog({
        template: "{player} can't move because they are in the brig",
        actor: 'admin',
        args: {
          player: player.name
        }
      })
    })
    return context.done()
  }

  const options = []
  const playerZone = game.getZoneByPlayerLocation(player)

  // Locations for Revealed Cylons
  if (game.checkPlayerIsRevealedCylon(player)) {
    options.push({
      name: 'Cylon Locations',
      options: game.getLocationsByArea('Cylon Locations')
                   .filter(l => l.name !== playerZone.name)
                   .map(l => l.details.name)
    })
  }

  // Locations for Humans
  else {
    const canChangeShips = game.getCardsKindByPlayer('skill', player).length > 0

    // Galactica Locations
    if (canChangeShips || (playerZone.details && playerZone.details.area === 'Galactica')) {
      options.push({
        name: 'Galactica',
        options: game.getLocationsByArea('Galactica')
                     .filter(l => !l.details.hazardous)
                     .filter(l => l.name !== playerZone.name)
                     .filter(l => !game.checkLocationIsDamaged(l))
                     .map(l => l.details.name)
      })
    }

    // Colonial One locations
    if (
      !game.checkColonialOneIsDestroyed()
      && (canChangeShips || (playerZone.details && playerZone.details.area === 'Colonial One'))
    ) {
      options.push({
        name: 'Colonial One',
        options: game.getLocationsByArea('Colonial One')
                     .filter(l => l.name !== playerZone.name)
                     .map(l => l.details.name)
      })
    }
  }

  options.push('Skip Movement')

  // If the player is in a Viper, they can move one step in space or land on a ship for one card
  if (game.checkPlayerIsInSpace(player)) {
    const spaceZone = game.getZoneByPlayerLocation(player)
    const adjacentZones = game.getZoneAdjacentToSpaceZone(spaceZone)

    return context.wait({
      actor: player.name,
      actions: [{
        name: 'Movement',
        options: [
          {
            name: 'Move Viper',
            options: adjacentZones.map(z => z.name),
          },
          ...options,
        ]
      }]
    })
  }

  return context.wait({
    actor: player.name,
    actions: [
      {
        name: 'Movement',
        options,
      },
    ]
  })
}
