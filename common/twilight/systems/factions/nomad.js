module.exports = {
  onAgendaOutcomeResolved(player, ctx, { winningOutcome, playerVotes }) {
    const vote = playerVotes[player.name]
    if (vote && vote.outcome === winningOutcome) {
      player.addTradeGoods(1)
      ctx.log.add({
        template: '{player} gains 1 trade good (Future Sight)',
        args: { player },
      })
    }
  },

  onCommoditiesReplenished(player, ctx) {
    if (!player.isAgentReady('artuno')) {
      return
    }

    const choice = ctx.actions.choose(player, ['Exhaust Artuno', 'Pass'], {
      title: 'Artuno the Betrayer: Exhaust to gain 1 trade good?',
    })

    if (choice[0] === 'Exhaust Artuno') {
      player.exhaustAgent('artuno')
      player.addTradeGoods(1)
      ctx.log.add({
        template: '{player} exhausts Artuno the Betrayer to gain 1 trade good',
        args: { player },
      })
    }
  },

  afterCombatResolved(player, ctx, { systemId, combatType }) {
    if (combatType !== 'space') {
      return
    }
    if (!player.isAgentReady('thundarian')) {
      return
    }

    const choice = ctx.actions.choose(player, ['Exhaust Thundarian', 'Pass'], {
      title: 'The Thundarian: Exhaust to place 1 cruiser in this system?',
    })

    if (choice[0] === 'Exhaust Thundarian') {
      player.exhaustAgent('thundarian')
      ctx.game._addUnit(systemId, 'space', 'cruiser', player.name)
      ctx.log.add({
        template: '{player} exhausts The Thundarian to place a cruiser in {system}',
        args: { player, system: systemId },
      })
    }
  },

  onGroundCombatStart(player, ctx, { systemId, planetId, opponentName }) {
    if (!player.isAgentReady('mercer')) {
      return
    }

    const planetUnits = ctx.state.units[systemId].planets[planetId]
    const enemyForces = planetUnits.filter(u => u.owner === opponentName && (u.type === 'infantry' || u.type === 'mech'))
    if (enemyForces.length === 0) {
      return
    }

    const choice = ctx.actions.choose(player, ['Exhaust Mercer', 'Pass'], {
      title: 'Field Marshal Mercer: Exhaust to remove 1 enemy ground force?',
    })

    if (choice[0] === 'Exhaust Mercer') {
      player.exhaustAgent('mercer')
      const target = enemyForces.find(u => u.type === 'infantry') || enemyForces[0]
      const idx = planetUnits.indexOf(target)
      if (idx !== -1) {
        planetUnits.splice(idx, 1)
      }
      ctx.log.add({
        template: '{player} exhausts Field Marshal Mercer to remove 1 {type}',
        args: { player, type: target.type },
      })
    }
  },
}
