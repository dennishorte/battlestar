module.exports = {
  onShipsEnterSystem(player, ctx, { systemId, moverName }) {
    if (player.name === moverName) {
      return
    }
    if (player.commandTokens.strategy <= 0) {
      return
    }

    const systemUnits = ctx.state.units[systemId]
    if (!systemUnits) {
      return
    }

    const ownShips = systemUnits.space.filter(u => u.owner === player.name)
    if (ownShips.length === 0) {
      return
    }

    const adjacentSystems = ctx.game._getAdjacentSystems(systemId)
      .filter(adjId => {
        const tokens = ctx.state.systems[adjId]?.commandTokens || []
        return !tokens.includes(player.name)
      })

    if (adjacentSystems.length === 0) {
      return
    }

    const choices = ['Pass', ...adjacentSystems]
    const selection = ctx.actions.choose(player, choices, {
      title: 'Foresight: Place token and move 1 ship to adjacent system?',
    })

    if (selection[0] === 'Pass') {
      return
    }

    const targetSystem = selection[0]

    player.commandTokens.strategy -= 1

    if (!ctx.state.systems[targetSystem]) {
      ctx.state.systems[targetSystem] = { commandTokens: [] }
    }
    ctx.state.systems[targetSystem].commandTokens.push(player.name)

    const shipTypes = [...new Set(ownShips.map(u => u.type))]
    let shipToMove
    if (shipTypes.length === 1) {
      shipToMove = shipTypes[0]
    }
    else {
      const shipChoice = ctx.actions.choose(player, shipTypes, {
        title: 'Choose ship to move',
      })
      shipToMove = shipChoice[0]
    }

    const shipIdx = systemUnits.space.findIndex(
      u => u.owner === player.name && u.type === shipToMove
    )
    if (shipIdx !== -1) {
      const [ship] = systemUnits.space.splice(shipIdx, 1)
      if (!ctx.state.units[targetSystem]) {
        ctx.state.units[targetSystem] = { space: [], planets: {} }
      }
      ctx.state.units[targetSystem].space.push(ship)
    }

    ctx.log.add({
      template: '{player} uses Foresight: moves {ship} to {system}',
      args: { player, ship: shipToMove, system: targetSystem },
    })
  },
}
