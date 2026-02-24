module.exports = {
  canMoveThroughSupernovae() {
    return true
  },

  componentActions: [
    {
      id: 'star-forge',
      name: 'Star Forge',
      abilityId: 'star-forge',
      isAvailable: (player) => player.commandTokens.strategy >= 1,
    },
  ],

  starForge(ctx, player) {
    const warSunSystems = []
    for (const [systemId, systemUnits] of Object.entries(ctx.state.units)) {
      if (systemUnits.space.some(u => u.owner === player.name && u.type === 'war-sun')) {
        warSunSystems.push(systemId)
      }
    }

    if (warSunSystems.length === 0) {
      return
    }

    player.commandTokens.strategy -= 1

    const unitChoice = ctx.actions.choose(player, ['2 Fighters', '1 Destroyer'], {
      title: 'Star Forge: Choose units to place',
    })

    let targetSystem
    if (warSunSystems.length === 1) {
      targetSystem = warSunSystems[0]
    }
    else {
      const sysChoice = ctx.actions.choose(player, warSunSystems, {
        title: 'Star Forge: Choose system',
      })
      targetSystem = sysChoice[0]
    }

    if (unitChoice[0] === '2 Fighters') {
      ctx.game._addUnit(targetSystem, 'space', 'fighter', player.name)
      ctx.game._addUnit(targetSystem, 'space', 'fighter', player.name)
      ctx.log.add({
        template: '{player} uses Star Forge: 2 fighters in {system}',
        args: { player, system: targetSystem },
      })
    }
    else {
      ctx.game._addUnit(targetSystem, 'space', 'destroyer', player.name)
      ctx.log.add({
        template: '{player} uses Star Forge: 1 destroyer in {system}',
        args: { player, system: targetSystem },
      })
    }
  },

  // Commander — Magmus: after spending a strategy token, gain 1 trade good
  onStrategyTokenSpent(player, ctx, { spendingPlayer }) {
    // Only triggers for own token spend
    if (player.name !== spendingPlayer.name) {
      return
    }

    if (!player.isCommanderUnlocked()) {
      return
    }

    player.addTradeGoods(1)
    ctx.log.add({
      template: 'Magmus: {player} gains 1 trade good',
      args: { player },
    })
  },
}
