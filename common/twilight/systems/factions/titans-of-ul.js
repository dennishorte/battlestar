module.exports = {
  afterExploration(player, ctx, planetId) {
    if (ctx.state.sleeperTokens[planetId]) {
      return
    }

    const choices = ['Place sleeper', 'Pass']
    const selection = ctx.actions.choose(player, choices, {
      title: `Terragenesis: Place a sleeper token on ${planetId}?`,
    })

    if (selection[0] === 'Place sleeper') {
      ctx.state.sleeperTokens[planetId] = player.name

      ctx.log.add({
        template: '{player} places a sleeper token on {planet} (Terragenesis)',
        args: { player, planet: planetId },
      })
    }
  },

  onSystemActivated(player, ctx, systemId) {
    const tile = ctx.game.res.getSystemTile(systemId) ||
      ctx.game.res.getSystemTile(Number(systemId))
    if (!tile) {
      return
    }

    // Awaken: replace sleeper tokens with PDS
    for (const planetId of tile.planets) {
      if (ctx.state.sleeperTokens[planetId] !== player.name) {
        continue
      }

      delete ctx.state.sleeperTokens[planetId]

      // Hecatoncheires DEPLOY: when placing a PDS on a planet,
      // may place 1 mech and 1 infantry instead
      const deployChoice = ctx.actions.choose(player, ['Deploy Mech + Infantry', 'Place PDS'], {
        title: `Hecatoncheires: Place mech + infantry on ${planetId} instead of PDS?`,
      })

      if (deployChoice[0] === 'Deploy Mech + Infantry') {
        ctx.game._addUnitToPlanet(systemId, planetId, 'mech', player.name)
        ctx.game._addUnitToPlanet(systemId, planetId, 'infantry', player.name)

        ctx.log.add({
          template: '{player} deploys mech + infantry on {planet} (Hecatoncheires)',
          args: { player, planet: planetId },
        })
      }
      else {
        ctx.game._addUnitToPlanet(systemId, planetId, 'pds', player.name)

        ctx.log.add({
          template: '{player} awakens sleeper on {planet}: PDS deployed (Awaken)',
          args: { player, planet: planetId },
        })
      }
    }

    // Ouranos DEPLOY: after activating a system containing your PDS,
    // may replace 1 PDS with the flagship
    // Only if flagship is not already deployed
    const flagshipDeployed = _isFlagshipDeployed(ctx)
    if (!flagshipDeployed) {
      const pdsUnits = []
      for (const planetId of (tile.planets || [])) {
        const planetUnits = ctx.state.units[systemId]?.planets[planetId] || []
        for (const unit of planetUnits) {
          if (unit.owner === player.name && unit.type === 'pds') {
            pdsUnits.push({ unit, planetId })
          }
        }
      }

      if (pdsUnits.length > 0) {
        const deployChoices = ['Deploy Ouranos', 'Pass']
        const choice = ctx.actions.choose(player, deployChoices, {
          title: 'Ouranos: Replace a PDS with your flagship?',
        })

        if (choice[0] === 'Deploy Ouranos') {
          // Choose which PDS to replace if multiple
          let targetPDS
          if (pdsUnits.length === 1) {
            targetPDS = pdsUnits[0]
          }
          else {
            const pdsChoices = pdsUnits.map(p => p.planetId)
            const pdsSel = ctx.actions.choose(player, pdsChoices, {
              title: 'Choose PDS to replace with Ouranos',
            })
            targetPDS = pdsUnits.find(p => p.planetId === pdsSel[0])
          }

          if (targetPDS) {
            // Remove the PDS
            const planetUnits = ctx.state.units[systemId].planets[targetPDS.planetId]
            const pdsIdx = planetUnits.findIndex(u => u.id === targetPDS.unit.id)
            if (pdsIdx !== -1) {
              planetUnits.splice(pdsIdx, 1)
            }

            // Add flagship to space
            ctx.game._addUnit(systemId, 'space', 'flagship', player.name)

            ctx.log.add({
              template: '{player} deploys Ouranos, replacing PDS on {planet}',
              args: { player, planet: targetPDS.planetId },
            })
          }
        }
      }
    }

    // Slumberstate Computing: check for coalescence with only PDS/mech
    if (player.hasTechnology('slumberstate-computing')) {
      _checkSlumberstateCoexistence(player, ctx, systemId, tile)
    }
  },

  checkCoalescence(player, ctx, { systemId, moverName }) {
    const systemUnits = ctx.state.units[systemId]
    if (!systemUnits) {
      return false
    }

    for (const unit of systemUnits.space) {
      if (unit.owner === moverName) {
        continue
      }
      if (unit.owner === player.name && unit.type === 'flagship') {
        return true
      }
    }

    for (const [, planetUnits] of Object.entries(systemUnits.planets)) {
      for (const unit of planetUnits) {
        if (unit.owner === moverName) {
          continue
        }
        if (unit.owner === player.name && unit.type === 'mech') {
          return true
        }
      }
    }

    return false
  },

  // Agent — Tellurian: When a hit is produced against a unit, exhaust to cancel that hit.
  onHitsProduced(player, ctx, { targetOwner, systemId, hits, combatType: _combatType }) {
    if (!player.isAgentReady()) {
      return hits
    }

    // Only offer when hits target the Titans player's own units
    if (targetOwner !== player.name) {
      return hits
    }

    if (hits <= 0) {
      return hits
    }

    const choice = ctx.actions.choose(player, ['Exhaust Tellurian', 'Pass'], {
      title: `Tellurian: Exhaust to cancel 1 hit against your units in system ${systemId}?`,
    })

    if (choice[0] === 'Exhaust Tellurian') {
      player.exhaustAgent()

      ctx.log.add({
        template: '{player} exhausts Tellurian to cancel 1 hit (Agent)',
        args: { player },
      })

      return hits - 1
    }

    return hits
  },

  // Commander — Tungstantus: When 1 or more of your units use PRODUCTION,
  // you may gain 1 trade good.
  afterProduction(player, ctx, { unitCount }) {
    if (!player.isCommanderUnlocked()) {
      return
    }

    if (unitCount <= 0) {
      return
    }

    player.addTradeGoods(1)
    ctx.log.add({
      template: 'Tungstantus: {player} gains 1 trade good',
      args: { player: player.name },
    })
  },

  checkCoalescenceOnPlanet(player, ctx, { systemId, planetId, moverName }) {
    const planetUnits = ctx.state.units[systemId]?.planets[planetId] || []
    for (const unit of planetUnits) {
      if (unit.owner === moverName) {
        continue
      }
      if (unit.owner === player.name && unit.type === 'mech') {
        return true
      }
    }
    return false
  },

  // Hero — Ul The Progenitor: GEOFORM
  // Ready Elysium and attach this card to it, increasing resource and influence by 3.
  // Elysium gains SPACE CANNON 5 (x3). Purge.
  componentActions: [
    {
      id: 'geoform',
      name: 'GEOFORM (Ul The Progenitor)',
      abilityId: 'awaken', // Use awaken as a proxy — all Titans have it
      isAvailable(player) {
        return player.isHeroUnlocked() && !player.isHeroPurged()
      },
    },
    {
      id: 'slumberstate-sleeper',
      name: 'Request Sleeper Placement (Slumberstate)',
      abilityId: 'awaken',
      isAvailable(player) {
        if (!player.hasTechnology('slumberstate-computing')) {
          return false
        }
        return true
      },
    },
  ],

  slumberstateSleeper(ctx, player) {
    // Ask which opponent to request sleeper placement from
    const others = ctx.players.all().filter(p => p.name !== player.name)
    const eligibleTargets = others.filter(other => {
      const planets = other.getControlledPlanets()
      return planets.some(pid => !ctx.state.sleeperTokens[pid])
    })

    if (eligibleTargets.length === 0) {
      return
    }

    const targetNames = eligibleTargets.map(p => p.name)
    const targetSel = ctx.actions.choose(player, targetNames, {
      title: 'Slumberstate Computing: Ask which player to allow sleeper placement?',
    })
    const targetName = targetSel[0]
    const target = ctx.players.byName(targetName)

    // Target player can accept or decline
    const response = ctx.actions.choose(target, ['Allow Sleeper', 'Decline'], {
      title: `${player.name} requests to place a sleeper token on one of your planets.`,
    })

    if (response[0] !== 'Allow Sleeper') {
      ctx.log.add({
        template: '{target} declines sleeper placement from {player}',
        args: { target: targetName, player: player.name },
      })
      return
    }

    // Choose which planet to place the sleeper on
    const eligiblePlanets = target.getControlledPlanets()
      .filter(pid => !ctx.state.sleeperTokens[pid])

    let targetPlanet
    if (eligiblePlanets.length === 1) {
      targetPlanet = eligiblePlanets[0]
    }
    else {
      const planetSel = ctx.actions.choose(player, eligiblePlanets, {
        title: 'Slumberstate Computing: Place sleeper on which planet?',
      })
      targetPlanet = planetSel[0]
    }

    ctx.state.sleeperTokens[targetPlanet] = player.name

    ctx.log.add({
      template: 'Slumberstate Computing: {player} places sleeper on {planet} (allowed by {target})',
      args: { player: player.name, planet: targetPlanet, target: targetName },
    })
  },

  geoform(ctx, player) {
    // Ready Elysium
    if (ctx.state.planets['elysium']) {
      ctx.state.planets['elysium'].exhausted = false
    }

    // Attach hero card to Elysium
    if (!ctx.state.heroAttachments) {
      ctx.state.heroAttachments = {}
    }
    ctx.state.heroAttachments['elysium'] = {
      faction: 'titans-of-ul',
      resourceBonus: 3,
      influenceBonus: 3,
      spaceCannonAbility: 'space-cannon-5x3',
    }

    ctx.log.add({
      template: '{player} uses GEOFORM: Elysium readied, +3 resource/influence, gains Space Cannon 5 (x3)',
      args: { player: player.name },
    })

    player.purgeHero()
    ctx.log.add({
      template: '{player} purges Ul The Progenitor',
      args: { player: player.name },
    })
  },

  // Hel-Titan II: may fire space cannon from adjacent systems
  // This is checked by the engine — we expose a method to indicate adjacency capability
  canFireSpaceCannonFromAdjacentSystem(player, _ctx) {
    return player.hasTechnology('hel-titan-ii')
  },

  // Slumberstate Computing: during status phase, draw 1 additional action card
  // per coexisting player
  getAdditionalActionCardDraw(player, ctx) {
    if (!player.hasTechnology('slumberstate-computing')) {
      return 0
    }

    const coexistence = ctx.state?.coexistence || ctx.game?.state?.coexistence || []
    return coexistence.filter(c => c.titanPlayer === player.name).length
  },
}


// Helper: check if Titans flagship is already deployed somewhere
function _isFlagshipDeployed(ctx) {
  for (const systemUnits of Object.values(ctx.state.units)) {
    for (const unit of systemUnits.space) {
      if (unit.type === 'flagship') {
        // Check if it belongs to a Titans player
        const owner = ctx.players.byName(unit.owner)
        if (owner?.faction?.id === 'titans-of-ul') {
          return true
        }
      }
    }
  }
  return false
}


// Slumberstate Computing: when Coalescence places only PDS/mech on a planet
// with opponent ground forces, may choose to coexist instead of combat
function _checkSlumberstateCoexistence(player, ctx, systemId, tile) {
  for (const planetId of tile.planets) {
    const planetUnits = ctx.state.units[systemId]?.planets[planetId] || []
    const ownUnits = planetUnits.filter(u => u.owner === player.name)
    const otherUnits = planetUnits.filter(u => u.owner !== player.name)

    if (otherUnits.length === 0) {
      continue
    }

    // Check if own units are only PDS (structure/ground force hybrid) or mech —
    // i.e., no additional combat units besides what was just placed by Awaken
    const ownCombatUnits = ownUnits.filter(u =>
      u.type === 'infantry' || u.type === 'mech'
    )
    // Only trigger if we have no other combat units — the PDS placed by Awaken
    // triggers coalescence but isn't a standard ground force
    const ownPDS = ownUnits.filter(u => u.type === 'pds')
    if (ownPDS.length > 0 && ownCombatUnits.length === 0) {
      const otherGroundForces = otherUnits.filter(u =>
        u.type === 'infantry' || u.type === 'mech'
      )
      if (otherGroundForces.length > 0) {
        const coexistChoice = ctx.actions.choose(player, ['Coexist', 'Fight'], {
          title: `Slumberstate Computing: Coexist on ${planetId} instead of ground combat?`,
        })

        if (coexistChoice[0] === 'Coexist') {
          if (!ctx.state.coexistence) {
            ctx.state.coexistence = []
          }

          const otherPlayer = otherGroundForces[0].owner
          ctx.state.coexistence.push({
            planetId,
            titanPlayer: player.name,
            otherPlayer,
          })

          ctx.log.add({
            template: 'Slumberstate Computing: {player} coexists with {other} on {planet}',
            args: { player: player.name, other: otherPlayer, planet: planetId },
          })
        }
      }
    }
  }
}
