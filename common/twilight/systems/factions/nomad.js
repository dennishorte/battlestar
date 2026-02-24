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

  // Commander — Navarch Feng: Can produce flagship without spending resources.
  getProductionCostOverride(player, _ctx, unitType) {
    if (!player.isCommanderUnlocked()) {
      return null
    }
    if (unitType === 'flagship') {
      return 0
    }
    return null
  },

  // Temporal Command Suite (faction tech): After any player's agent becomes
  // exhausted, you may exhaust this card to ready that agent. If you ready
  // another player's agent, you may perform a transaction with that player.
  onAnyAgentExhausted(nomadPlayer, ctx, { exhaustedPlayer, agentId }) {
    if (!nomadPlayer.hasTechnology('temporal-command-suite')) {
      return
    }
    if (!ctx.game._isTechReady(nomadPlayer, 'temporal-command-suite')) {
      return
    }

    const agentLabel = agentId || 'agent'
    const isOwnAgent = exhaustedPlayer.name === nomadPlayer.name

    const choice = ctx.actions.choose(nomadPlayer, ['Exhaust Temporal Command Suite', 'Pass'], {
      title: `Temporal Command Suite: Exhaust to ready ${exhaustedPlayer.name}'s ${agentLabel}?`,
    })

    if (choice[0] !== 'Exhaust Temporal Command Suite') {
      return
    }

    ctx.game._exhaustTech(nomadPlayer, 'temporal-command-suite')
    exhaustedPlayer.readyAgent(agentId)

    ctx.log.add({
      template: "Temporal Command Suite: {player} readies {target}'s {agent}",
      args: { player: nomadPlayer.name, target: exhaustedPlayer.name, agent: agentLabel },
    })

    // If readying another player's agent, may perform a transaction
    if (!isOwnAgent) {
      const transactChoice = ctx.actions.choose(nomadPlayer, ['Transact', 'Pass'], {
        title: `Temporal Command Suite: Perform a transaction with ${exhaustedPlayer.name}?`,
      })

      if (transactChoice[0] === 'Transact') {
        ctx.game._performTransaction?.(nomadPlayer, exhaustedPlayer)

        ctx.log.add({
          template: 'Temporal Command Suite: {player} transacts with {target}',
          args: { player: nomadPlayer.name, target: exhaustedPlayer.name },
        })
      }
    }
  },

  // Thunder's Paradox (faction tech): At the start of any player's turn, you
  // may exhaust 1 of your ready agents to ready any other agent you control.
  onAnyTurnStart(nomadPlayer, ctx, { activePlayer: _activePlayer }) {
    this._offerThundersParadox(nomadPlayer, ctx)
  },

  onTurnStart(nomadPlayer, ctx) {
    this._offerThundersParadox(nomadPlayer, ctx)
  },

  _offerThundersParadox(nomadPlayer, ctx) {
    if (!nomadPlayer.hasTechnology('thunders-paradox')) {
      return
    }

    if (!nomadPlayer.leaders.agents) {
      return
    }

    const readyAgents = nomadPlayer.leaders.agents.filter(a => a.status === 'ready')
    const exhaustedAgents = nomadPlayer.leaders.agents.filter(a => a.status === 'exhausted')

    // Need at least 1 ready agent to exhaust AND at least 1 exhausted agent to ready
    if (readyAgents.length === 0 || exhaustedAgents.length === 0) {
      return
    }

    const choice = ctx.actions.choose(nomadPlayer, ["Use Thunder's Paradox", 'Pass'], {
      title: "Thunder's Paradox: Exhaust 1 agent to ready another?",
    })

    if (choice[0] !== "Use Thunder's Paradox") {
      return
    }

    // Choose which ready agent to exhaust
    let agentToExhaust
    if (readyAgents.length === 1) {
      agentToExhaust = readyAgents[0]
    }
    else {
      const exhaustChoices = readyAgents.map(a => a.id)
      const selection = ctx.actions.choose(nomadPlayer, exhaustChoices, {
        title: 'Choose agent to exhaust:',
      })
      agentToExhaust = readyAgents.find(a => a.id === selection[0])
    }

    // Choose which exhausted agent to ready
    let agentToReady
    if (exhaustedAgents.length === 1) {
      agentToReady = exhaustedAgents[0]
    }
    else {
      const readyChoices = exhaustedAgents.map(a => a.id)
      const selection = ctx.actions.choose(nomadPlayer, readyChoices, {
        title: 'Choose agent to ready:',
      })
      agentToReady = exhaustedAgents.find(a => a.id === selection[0])
    }

    // Directly manipulate agent status (bypass exhaustAgent to avoid triggering
    // Temporal Command Suite recursion)
    agentToExhaust.status = 'exhausted'
    agentToReady.status = 'ready'

    ctx.log.add({
      template: "Thunder's Paradox: {player} exhausts {exhausted} to ready {readied}",
      args: {
        player: nomadPlayer.name,
        exhausted: agentToExhaust.id,
        readied: agentToReady.id,
      },
    })
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
