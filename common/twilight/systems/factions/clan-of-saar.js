module.exports = {
  onPlanetGained(player, ctx) {
    player.addTradeGoods(1)
    ctx.log.add({
      template: '{player} gains 1 trade good (Scavenge)',
      args: { player },
    })
  },

  // Agent — Captain Mendosa: After a player activates a system, exhaust to
  // increase the move value of 1 of that player's ships to match the highest
  // move value on the board.
  onAnySystemActivated(saarPlayer, ctx, { systemId: _systemId, activatingPlayer }) {
    if (!saarPlayer.isAgentReady()) {
      return
    }

    // Find the highest move value among all ships on the board
    let highestMove = 0
    for (const sysId of Object.keys(ctx.state.units)) {
      const systemUnits = ctx.state.units[sysId]
      for (const unit of systemUnits.space) {
        const unitDef = ctx.game._getUnitStats(unit.owner, unit.type)
        if (unitDef && unitDef.move > highestMove) {
          highestMove = unitDef.move
        }
      }
    }

    if (highestMove <= 0) {
      return
    }

    // Find which of the activating player's ship types would actually benefit
    const activatingShipTypes = new Set()
    for (const sysId of Object.keys(ctx.state.units)) {
      for (const unit of ctx.state.units[sysId].space) {
        if (unit.owner === activatingPlayer.name) {
          const unitDef = ctx.game._getUnitStats(unit.owner, unit.type)
          if (unitDef && unitDef.category === 'ship' && unitDef.move > 0 && unitDef.move < highestMove) {
            activatingShipTypes.add(unit.type)
          }
        }
      }
    }

    // No benefit if all ships already have the highest move value
    if (activatingShipTypes.size === 0) {
      return
    }

    const choice = ctx.actions.choose(saarPlayer, ['Exhaust Captain Mendosa', 'Pass'], {
      title: `Captain Mendosa: Exhaust to set 1 of ${activatingPlayer.name}'s ships to move ${highestMove}?`,
    })

    if (choice[0] !== 'Exhaust Captain Mendosa') {
      return
    }

    saarPlayer.exhaustAgent()

    // Choose which ship type gets the bonus
    const shipTypeArray = [...activatingShipTypes]
    let targetShipType
    if (shipTypeArray.length === 1) {
      targetShipType = shipTypeArray[0]
    }
    else {
      const typeChoice = ctx.actions.choose(saarPlayer, shipTypeArray, {
        title: `Captain Mendosa: Choose ship type to set to move ${highestMove}`,
      })
      targetShipType = typeChoice[0]
    }

    // Store the bonus on the current tactical action
    ctx.state.currentTacticalAction.mendosaBonus = {
      playerName: activatingPlayer.name,
      shipType: targetShipType,
      moveValue: highestMove,
    }

    ctx.log.add({
      template: 'Captain Mendosa: {player} sets {target}\'s {shipType} move value to {moveValue}',
      args: {
        player: saarPlayer.name,
        target: activatingPlayer.name,
        shipType: targetShipType,
        moveValue: highestMove,
      },
    })
  },
}
