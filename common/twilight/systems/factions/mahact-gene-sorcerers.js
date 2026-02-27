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

  // Arvicon Rex (Flagship): +2 combat bonus against opponents whose command
  // token is NOT in fleet pool.
  getSpaceCombatModifier(player, ctx, systemId) {
    // Check if flagship is in this system
    const systemUnits = ctx.state.units[systemId]
    if (!systemUnits) {
      return 0
    }
    const hasFlagship = systemUnits.space.some(
      u => u.owner === player.name && u.type === 'flagship'
    )
    if (!hasFlagship) {
      return 0
    }

    // Find the opponent in the system
    const opponentNames = [...new Set(
      systemUnits.space
        .filter(u => u.owner !== player.name)
        .map(u => u.owner)
    )]

    if (opponentNames.length === 0) {
      return 0
    }

    const opponentName = opponentNames[0]
    const captured = ctx.state.capturedCommandTokens[player.name] || []

    // If opponent's token is NOT captured, flagship gets +2 (return -2 since negative = bonus)
    if (!captured.includes(opponentName)) {
      return -2
    }
    return 0
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


  // ---------------------------------------------------------------------------
  // Commander — Il Na Viroset
  // During tactical actions, you can activate systems that already contain
  // your command tokens. If you do, return both command tokens to your
  // reinforcements and end your turn.
  // ---------------------------------------------------------------------------

  /**
   * Called when the Mahact player activates a system. If the system already
   * contains their command token and the commander is unlocked, allow
   * reactivation: return both tokens and signal turn end.
   */
  onSystemActivated(player, ctx, systemId) {
    if (!player.isCommanderUnlocked()) {
      return
    }

    const system = ctx.state.systems[systemId]
    if (!system) {
      return
    }

    // Count how many of this player's tokens are in the system.
    // After the engine places the new token, there would be 2 if reactivating.
    const tokenCount = system.commandTokens.filter(t => t === player.name).length
    if (tokenCount < 2) {
      return
    }

    // Remove both tokens (return to reinforcements)
    system.commandTokens = system.commandTokens.filter(t => t !== player.name)
    player.commandTokens.tactics += 2  // Return both to reinforcements

    ctx.log.add({
      template: '{player} reactivates {system} (Il Na Viroset): returns both command tokens to reinforcements',
      args: { player: player.name, system: systemId },
    })

    // Signal that this tactical action should end immediately
    ctx.state.mahactReactivation = true
  },


  // ---------------------------------------------------------------------------
  // Genetic Recombination (faction technology — green)
  // Before a player casts votes during an agenda, you may exhaust this card.
  // That player must cast at least 1 vote for an outcome of your choice or
  // remove 1 token from their fleet pool and return it to their reinforcements.
  // ---------------------------------------------------------------------------

  /**
   * Called by the dispatcher's onBeforePlayerVote hook. Mahact may intervene
   * before each player casts their vote.
   */
  onBeforePlayerVote(mahactPlayer, ctx, { votingPlayer, outcomes }) {
    if (votingPlayer.name === mahactPlayer.name) {
      return null
    }

    if (!mahactPlayer.hasTechnology('genetic-recombination')) {
      return null
    }

    if (!ctx.game._isTechReady(mahactPlayer, 'genetic-recombination')) {
      return null
    }

    const choice = ctx.actions.choose(mahactPlayer, ['Use Genetic Recombination', 'Pass'], {
      title: `Genetic Recombination: Force ${votingPlayer.name}'s vote or fleet token loss?`,
    })

    if (choice[0] !== 'Use Genetic Recombination') {
      return null
    }

    ctx.game._exhaustTech(mahactPlayer, 'genetic-recombination')

    // Choose which outcome to force
    const outcomeChoice = ctx.actions.choose(mahactPlayer, outcomes, {
      title: `Genetic Recombination: Choose outcome ${votingPlayer.name} must vote for`,
    })
    const forcedOutcome = outcomeChoice[0]

    // The voting player must comply or lose a fleet token
    const voteOrLose = ctx.actions.choose(votingPlayer, [`Vote ${forcedOutcome}`, 'Remove Fleet Token'], {
      title: `Genetic Recombination: Vote "${forcedOutcome}" or remove 1 fleet supply token`,
    })

    if (voteOrLose[0] === 'Remove Fleet Token') {
      if (votingPlayer.commandTokens.fleet > 0) {
        votingPlayer.commandTokens.fleet -= 1
      }
      ctx.log.add({
        template: 'Genetic Recombination: {target} removes 1 fleet supply token rather than comply',
        args: { target: votingPlayer.name },
      })
      return null  // Player continues to vote normally (may abstain)
    }

    ctx.log.add({
      template: 'Genetic Recombination: {player} forces {target} to vote {outcome}',
      args: { player: mahactPlayer.name, target: votingPlayer.name, outcome: forcedOutcome },
    })

    // Return the forced outcome so the engine can apply it
    return { forcedOutcome }
  },


  // ---------------------------------------------------------------------------
  // Crimson Legionnaire I/II — after destroyed, gain 1 commodity or convert
  // 1 commodity to a trade good.
  // With Crimson Legionnaire II: also place destroyed units on card; they
  // return to a home system planet at start of next turn.
  // ---------------------------------------------------------------------------

  onAnyUnitDestroyed(player, ctx, { systemId: _systemId, unit, planetId: _planetId, destroyerName: _destroyerName }) {
    // Only applies to Mahact's own infantry (Crimson Legionnaires)
    if (unit.owner !== player.name) {
      return
    }
    if (unit.type !== 'infantry') {
      return
    }

    // Offer commodity gain or conversion
    const choices = []
    if (player.commodities < player.maxCommodities) {
      choices.push('Gain 1 commodity')
    }
    if (player.commodities > 0) {
      choices.push('Convert 1 commodity to trade good')
    }
    if (choices.length === 0) {
      return
    }
    choices.push('Decline')

    const choice = ctx.actions.choose(player, choices, {
      title: 'Crimson Legionnaire destroyed: gain commodity or convert?',
    })

    if (choice[0] === 'Gain 1 commodity') {
      player.commodities = Math.min(player.commodities + 1, player.maxCommodities)
      ctx.log.add({
        template: 'Crimson Legionnaire: {player} gains 1 commodity',
        args: { player: player.name },
      })
    }
    else if (choice[0] === 'Convert 1 commodity to trade good') {
      player.commodities -= 1
      player.addTradeGoods(1)
      ctx.log.add({
        template: 'Crimson Legionnaire: {player} converts 1 commodity to 1 trade good',
        args: { player: player.name },
      })
    }

    // Crimson Legionnaire II: place destroyed unit on card for revival
    if (player.hasTechnology('crimson-legionnaire-ii')) {
      if (!ctx.state.crimsonLegionnaireRevival) {
        ctx.state.crimsonLegionnaireRevival = {}
      }
      if (!ctx.state.crimsonLegionnaireRevival[player.name]) {
        ctx.state.crimsonLegionnaireRevival[player.name] = 0
      }
      ctx.state.crimsonLegionnaireRevival[player.name]++

      ctx.log.add({
        template: 'Crimson Legionnaire II: {player} places destroyed infantry on card for revival',
        args: { player: player.name },
      })
    }
  },

  // At start of Mahact's turn, revive Crimson Legionnaire II units to home system
  onTurnStart(player, ctx) {
    if (!ctx.state.crimsonLegionnaireRevival) {
      return
    }
    const count = ctx.state.crimsonLegionnaireRevival[player.name] || 0
    if (count === 0) {
      return
    }

    // Find a planet the player controls in their home system
    const homeSystemId = player.faction.homeSystem
    if (!homeSystemId) {
      return
    }

    const systemUnits = ctx.state.units[homeSystemId]
    if (!systemUnits) {
      return
    }

    // Find a controlled planet in the home system
    let targetPlanet = null
    for (const planetId of Object.keys(systemUnits.planets)) {
      if (ctx.state.planets[planetId]?.controller === player.name) {
        targetPlanet = planetId
        break
      }
    }

    if (!targetPlanet) {
      return
    }

    for (let i = 0; i < count; i++) {
      ctx.game._addUnit(homeSystemId, targetPlanet, 'infantry', player.name)
    }

    ctx.log.add({
      template: 'Crimson Legionnaire II: {player} places {count} infantry on {planet}',
      args: { player: player.name, count, planet: targetPlanet },
    })

    ctx.state.crimsonLegionnaireRevival[player.name] = 0
  },


  // ---------------------------------------------------------------------------
  // Component Actions — Hero and Vaults of the Heir
  // ---------------------------------------------------------------------------

  componentActions: [
    // Hero — Airo Shir Aur: BENEDICTION
    {
      id: 'airo-shir-aur-hero',
      name: 'Airo Shir Aur',
      abilityId: 'edict',  // All Mahact players have edict
      isAvailable: function(player) {
        return player.isHeroUnlocked() && !player.isHeroPurged()
      },
    },
    // Vaults of the Heir (faction tech): ACTION — exhaust and purge 1 tech to gain 1 relic
    {
      id: 'vaults-of-the-heir',
      name: 'Vaults of the Heir',
      abilityId: 'edict',
      isAvailable: function(player) {
        if (!player.hasTechnology('vaults-of-the-heir')) {
          return false
        }
        // Must be ready (not exhausted)
        if ((player.exhaustedTechs || []).includes('vaults-of-the-heir')) {
          return false
        }
        // Must have at least 1 other technology to purge
        const techs = player.getTechIds().filter(id => id !== 'vaults-of-the-heir')
        return techs.length > 0
      },
    },
  ],


  // ---------------------------------------------------------------------------
  // Hero — Airo Shir Aur: BENEDICTION
  // ACTION: Move all units in the space area of any system to an adjacent
  // system that contains a different player's ships. Space combat is resolved
  // in that system; neither player can retreat. Then, purge this card.
  // ---------------------------------------------------------------------------

  airoShirAurHero(ctx, player) {
    // Find all systems with space units belonging to any player
    const candidateSystems = []
    for (const [systemId, systemUnits] of Object.entries(ctx.state.units)) {
      const spaceUnits = systemUnits.space || []
      if (spaceUnits.length === 0) {
        continue
      }

      // Check if there's an adjacent system with a different player's ships
      const owners = [...new Set(spaceUnits.map(u => u.owner))]
      const adjacentSystems = ctx.game._getAdjacentSystems(systemId)

      for (const adjId of adjacentSystems) {
        const adjUnits = ctx.state.units[adjId]?.space || []
        const adjOwners = [...new Set(adjUnits.map(u => u.owner))]

        // Need a different player's ships in adjacent system
        for (const adjOwner of adjOwners) {
          for (const srcOwner of owners) {
            if (srcOwner !== adjOwner) {
              candidateSystems.push({
                fromSystem: systemId,
                toSystem: adjId,
                moverOwner: srcOwner,
                targetOwner: adjOwner,
              })
            }
          }
        }
      }
    }

    if (candidateSystems.length === 0) {
      ctx.log.add({
        template: '{player} purges Airo Shir Aur (no valid targets)',
        args: { player: player.name },
      })
      player.purgeHero()
      return
    }

    // Choose source system
    const sourceSystemIds = [...new Set(candidateSystems.map(c => c.fromSystem))]
    const sourceChoice = ctx.actions.choose(player, sourceSystemIds, {
      title: 'Benediction: Choose system to move units FROM',
    })
    const fromSystem = sourceChoice[0]

    // Choose target system (adjacent with different player's ships)
    const validTargets = candidateSystems.filter(c => c.fromSystem === fromSystem)
    const targetSystemIds = [...new Set(validTargets.map(c => c.toSystem))]
    const targetChoice = ctx.actions.choose(player, targetSystemIds, {
      title: 'Benediction: Choose adjacent system to move units TO',
    })
    const toSystem = targetChoice[0]

    // Move ALL units from source space area to target space area
    const sourceUnits = ctx.state.units[fromSystem]
    const unitsToMove = [...sourceUnits.space]
    sourceUnits.space = []

    if (!ctx.state.units[toSystem]) {
      ctx.state.units[toSystem] = { space: [], planets: {} }
    }
    for (const unit of unitsToMove) {
      ctx.state.units[toSystem].space.push(unit)
    }

    ctx.log.add({
      template: 'Benediction: {player} moves all units from {from} to {to}',
      args: { player: player.name, from: fromSystem, to: toSystem },
    })

    // Resolve space combat with no retreats
    ctx.state.benedictionNoRetreat = true
    ctx.game._spaceCombat(player, toSystem)
    delete ctx.state.benedictionNoRetreat

    // Purge the hero
    player.purgeHero()
    ctx.log.add({
      template: '{player} purges Airo Shir Aur',
      args: { player: player.name },
    })
  },


  // ---------------------------------------------------------------------------
  // Vaults of the Heir (faction technology)
  // ACTION: Exhaust this card and purge 1 of your technologies to gain 1 relic.
  // ---------------------------------------------------------------------------

  vaultsOfTheHeir(ctx, player) {
    ctx.game._exhaustTech(player, 'vaults-of-the-heir')

    // Choose a technology to purge (cannot purge Vaults itself since it's being exhausted)
    const techIds = player.getTechIds().filter(id => id !== 'vaults-of-the-heir')

    if (techIds.length === 0) {
      ctx.log.add({
        template: '{player} exhausts Vaults of the Heir but has no tech to purge',
        args: { player: player.name },
      })
      return
    }

    const techChoice = ctx.actions.choose(player, techIds, {
      title: 'Vaults of the Heir: Choose technology to purge',
    })
    const purgedTechId = techChoice[0]

    // Remove the technology from the player
    const techZone = ctx.game.zones.byPlayer(player, 'technologies')
    if (techZone) {
      const cardId = `${player.name}-${purgedTechId}`
      try {
        const card = ctx.game.cards.byId(cardId)
        if (card) {
          techZone.remove(card)
        }
      }
      catch {
        // Card not found — remove by filtering
      }
    }

    ctx.log.add({
      template: 'Vaults of the Heir: {player} purges {tech} to gain 1 relic',
      args: { player: player.name, tech: purgedTechId },
    })

    ctx.game._gainRelic(player.name)
  },


  // ---------------------------------------------------------------------------
  // Mech — Starlancer (DEPLOY)
  // After a player whose command token is in your fleet pool activates a
  // system containing this mech, you may spend their token from your fleet
  // pool to end their turn; they gain that token.
  // ---------------------------------------------------------------------------

  onAnySystemActivated(player, ctx, { systemId, activatingPlayer }) {
    if (activatingPlayer.name === player.name) {
      return
    }

    // Check if Mahact has the activating player's command token in fleet pool
    const captured = ctx.state.capturedCommandTokens[player.name] || []
    if (!captured.includes(activatingPlayer.name)) {
      return
    }

    // Check if Mahact has a mech in the activated system
    const systemUnits = ctx.state.units[systemId]
    if (!systemUnits) {
      return
    }
    const hasMech = systemUnits.space.some(
      u => u.owner === player.name && u.type === 'mech'
    ) || Object.values(systemUnits.planets).some(
      units => units.some(u => u.owner === player.name && u.type === 'mech')
    )

    if (!hasMech) {
      return
    }

    const choice = ctx.actions.choose(player, ['Spend Token (End Turn)', 'Pass'], {
      title: `Starlancer: Spend ${activatingPlayer.name}'s token to end their turn?`,
    })

    if (choice[0] !== 'Spend Token (End Turn)') {
      return
    }

    // Remove the captured token
    const idx = captured.indexOf(activatingPlayer.name)
    if (idx !== -1) {
      captured.splice(idx, 1)
    }

    // Return the token to the activating player
    activatingPlayer.commandTokens.tactics += 1

    ctx.log.add({
      template: 'Starlancer: {player} spends {target} token to end their turn',
      args: { player: player.name, target: activatingPlayer.name },
    })

    // Signal that the activating player's turn should end immediately
    ctx.state.mahactMechEndTurn = true
  },
}
