module.exports = {
  // Agent — Z'eu: After any player's command token is placed in a system,
  // exhaust to return that token to that player's reinforcements.
  onCommandTokenPlaced(player, ctx, { systemId, placerName }) {
    if (!player.isAgentReady()) {
      return
    }

    // The token must actually be in the system
    const tokens = ctx.state.systems[systemId]?.commandTokens || []
    if (!tokens.includes(placerName)) {
      return
    }

    const choice = ctx.actions.choose(player, ["Exhaust Z'eu", 'Pass'], {
      title: `Z'eu: Exhaust to return ${placerName}'s command token from system ${systemId}?`,
    })

    if (choice[0] !== "Exhaust Z'eu") {
      return
    }

    player.exhaustAgent()

    // Remove the token from the system
    const idx = tokens.indexOf(placerName)
    if (idx !== -1) {
      tokens.splice(idx, 1)
    }

    // Return to the placer's reinforcements (tactic pool)
    const placer = ctx.game.players.byName(placerName)
    if (placer) {
      placer.commandTokens.tactics++
    }

    ctx.log.add({
      template: "{player} exhausts Z'eu: returns {target}'s command token from {system}",
      args: { player: player.name, target: placerName, system: systemId },
    })
  },

  // Foresight: After another player moves ships into a system with your ships,
  // place 1 strategy token in an adjacent system without other players' ships
  // and move your ships there.
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
        // Cannot place a token in a system where you already have one
        const tokens = ctx.state.systems[adjId]?.commandTokens || []
        if (tokens.includes(player.name)) {
          return false
        }
        // Cannot move into a system that contains another player's ships
        const adjUnits = ctx.state.units[adjId]
        if (adjUnits) {
          const otherShips = adjUnits.space.filter(
            u => u.owner !== player.name
          )
          if (otherShips.length > 0) {
            return false
          }
        }
        return true
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

    // Move all own ships from the active system to the target system
    if (!ctx.state.units[targetSystem]) {
      ctx.state.units[targetSystem] = { space: [], planets: {} }
    }

    const shipsToMove = []
    for (let i = systemUnits.space.length - 1; i >= 0; i--) {
      if (systemUnits.space[i].owner === player.name) {
        const [ship] = systemUnits.space.splice(i, 1)
        shipsToMove.push(ship)
      }
    }
    for (const ship of shipsToMove) {
      ctx.state.units[targetSystem].space.push(ship)
    }

    const movedTypes = [...new Set(shipsToMove.map(s => s.type))].join(', ')
    ctx.log.add({
      template: '{player} uses Foresight: moves {ships} to {system}',
      args: { player, ships: movedTypes, system: targetSystem },
    })
  },
}
