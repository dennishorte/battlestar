const { transitionFactory } = require('./factory.js')
const bsgutil = require('../util.js')

module.exports = transitionFactory(
  {},
  generateOptions,
  handleResponse,
)

function handleResponse(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)
  const selection = context.response.option[0]
  const selectionName = bsgutil.optionName(selection)

  if (selectionName === 'Skip Movement') {
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
  else if (selectionName === 'Move Viper') {
    const zone = game.getZoneByPlayerLocation(player)
    const viper = zone.cards.find(c => c.name === 'viper')
    const token = zone.cards.find(c => c.name === player.name && c.kind === 'player-token')
    const newZone = game.getZoneByName(selection.option[0])

    game.rk.sessionStart(session => {
      session.move(token, newZone.cards, newZone.cards.length)
      session.move(viper, newZone.cards, newZone.cards.length)
    })

    return context.done()
  }

  const playerZone = game.getZoneByPlayerLocation(player)
  const targetName = bsgutil.optionName(selection.option[0])
  const targetZone = game.getZoneByLocationName(targetName)
  const sameShip = playerZone.details && playerZone.details.area === targetZone.details.area

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

function generateOptions(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)
  const character = game.getCardCharacterByPlayer(player)

  if (game.getRound() === 1 && character.name === 'Karl "Helo" Agathon') {
    game.rk.sessionStart(() => {
      game.mLog({
        template: "{player} can't move on the first round because Helo is stranded",
        args: {
          player: player.name,
        }
      })
    })
    return context.done()
  }

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
      max: 1,
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
      let description
      if (playerZone.details.area === 'Galactica') {
        description = "no cost"
      }
      else {
        description = "must discard one skill card to change ships"
      }

      options.push({
        name: 'Galactica',
        description,
        max: 1,
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
      let description
      if (playerZone.details.area === 'Colonial One') {
        description = "no cost"
      }
      else {
        description = "must discard one skill card to change ships"
      }

      options.push({
        name: 'Colonial One',
        max: 1,
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
            max: 1,
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
