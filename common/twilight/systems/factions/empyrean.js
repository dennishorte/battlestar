module.exports = {
  canMoveThroughNebulae() {
    return true
  },

  onPreMovement(player, ctx, { activatingPlayer }) {
    if (player.name === activatingPlayer.name) {
      return
    }

    const hasShips = Object.values(ctx.state.units).some(
      su => su.space.some(u => u.owner === player.name)
    )
    if (!hasShips) {
      return
    }

    const choice = ctx.actions.choose(player, ['Allow Passage', 'Deny'], {
      title: `Aetherpassage: Allow ${activatingPlayer.name} to move through your systems?`,
    })

    if (choice[0] === 'Allow Passage') {
      ctx.state.aetherpassageGrant = player.name

      ctx.log.add({
        template: '{empyrean} grants aetherpassage to {player}',
        args: { empyrean: player, player: activatingPlayer },
      })
    }
  },

  // Commander — Xuange: After another player moves ships into a system that
  // contains 1 of your command tokens, you may return that token to your
  // reinforcements.
  onShipsEnterSystem(player, ctx, { systemId, moverName }) {
    if (!player.isCommanderUnlocked()) {
      return
    }

    // Check if the system contains a command token belonging to the Empyrean player
    const tokens = ctx.state.systems[systemId]?.commandTokens || []
    if (!tokens.includes(player.name)) {
      return
    }

    const choice = ctx.actions.choose(player, ['Return Token', 'Pass'], {
      title: `Xuange: ${moverName} moved ships into a system with your token. Return it?`,
    })

    if (choice[0] === 'Return Token') {
      const idx = tokens.indexOf(player.name)
      if (idx !== -1) {
        tokens.splice(idx, 1)
      }

      player.commandTokens.tactics += 1

      ctx.log.add({
        template: 'Xuange: {player} returns command token from system {system}',
        args: { player: player.name, system: systemId },
      })
    }
  },

  // Agent — Acamar: After a player activates a system, exhaust to either
  // gain 1 trade good, or give the activating player 1 command token.
  onAnySystemActivated(empyreanPlayer, ctx, { systemId: _systemId, activatingPlayer }) {
    if (!empyreanPlayer.isAgentReady()) {
      return
    }

    const choices = ['Exhaust Acamar', 'Pass']
    const choice = ctx.actions.choose(empyreanPlayer, choices, {
      title: `Acamar: ${activatingPlayer.name} activated a system. Exhaust agent?`,
    })

    if (choice[0] !== 'Exhaust Acamar') {
      return
    }

    empyreanPlayer.exhaustAgent()

    const effectChoices = [
      'Gain 1 Trade Good',
      `Give ${activatingPlayer.name} 1 Command Token`,
    ]
    const effectChoice = ctx.actions.choose(empyreanPlayer, effectChoices, {
      title: 'Acamar: Choose effect',
    })

    if (effectChoice[0] === 'Gain 1 Trade Good') {
      empyreanPlayer.addTradeGoods(1)
      ctx.log.add({
        template: 'Acamar: {player} gains 1 trade good',
        args: { player: empyreanPlayer.name },
      })
    }
    else {
      activatingPlayer.commandTokens.tactics += 1
      ctx.log.add({
        template: 'Acamar: {player} gives {target} 1 command token',
        args: { player: empyreanPlayer.name, target: activatingPlayer.name },
      })
    }
  },
}
