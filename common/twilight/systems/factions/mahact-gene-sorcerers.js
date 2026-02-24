module.exports = {
  // Edict: When you win a combat, place 1 command token from your opponent's
  // reinforcements in your fleet pool if it does not already contain 1 of
  // that player's tokens.
  afterCombatResolved(player, ctx, { loserName }) {
    if (!ctx.state.capturedCommandTokens[player.name]) {
      ctx.state.capturedCommandTokens[player.name] = []
    }

    // Cannot capture if already holding this player's token
    if (ctx.state.capturedCommandTokens[player.name].includes(loserName)) {
      ctx.log.add({
        template: '{player} already has {loser} command token in fleet pool (Edict)',
        args: { player, loser: loserName },
      })
      return
    }

    ctx.state.capturedCommandTokens[player.name].push(loserName)

    ctx.log.add({
      template: '{player} captures {loser} command token (Edict)',
      args: { player, loser: loserName },
    })
  },

  getCapturedTokenFleetBonus(player, ctx) {
    return (ctx.state.capturedCommandTokens[player.name] || []).length
  },

  // Agent — Jae Mir Kan: When you would spend a command token during the
  // secondary ability of a strategic action, you may exhaust this card to
  // remove 1 of the active player's command tokens from the board and use
  // it instead.
  onStrategyTokenSpent(player, ctx, { spendingPlayer, activePlayerName }) {
    // Only triggers for the Mahact player's own token spend
    if (player.name !== spendingPlayer.name) {
      return
    }

    if (!player.isAgentReady()) {
      return
    }

    // Find systems with the active player's command tokens on the board
    const activePlayerSystems = []
    for (const [systemId, systemData] of Object.entries(ctx.state.systems)) {
      if (systemData.commandTokens && systemData.commandTokens.includes(activePlayerName)) {
        activePlayerSystems.push(systemId)
      }
    }

    if (activePlayerSystems.length === 0) {
      return
    }

    const choice = ctx.actions.choose(player, ['Exhaust Jae Mir Kan', 'Pass'], {
      title: `Jae Mir Kan: Exhaust to use ${activePlayerName}'s command token instead of your own?`,
    })

    if (choice[0] !== 'Exhaust Jae Mir Kan') {
      return
    }

    player.exhaustAgent()

    // Refund the strategy token that was already spent
    player.commandTokens.strategy += 1

    // Choose which of the active player's command tokens to remove
    let targetSystem
    if (activePlayerSystems.length === 1) {
      targetSystem = activePlayerSystems[0]
    }
    else {
      const sysChoice = ctx.actions.choose(player, activePlayerSystems, {
        title: `Jae Mir Kan: Choose system to remove ${activePlayerName}'s command token`,
      })
      targetSystem = sysChoice[0]
    }

    // Remove the active player's command token from the system
    const tokens = ctx.state.systems[targetSystem].commandTokens
    const idx = tokens.indexOf(activePlayerName)
    if (idx !== -1) {
      tokens.splice(idx, 1)
    }

    ctx.log.add({
      template: '{player} exhausts Jae Mir Kan: removes {target} command token from {system} (Agent)',
      args: { player: player.name, target: activePlayerName, system: targetSystem },
    })
  },
}
