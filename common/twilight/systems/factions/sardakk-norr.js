module.exports = {
  // Unrelenting: +1 to all combat rolls (lower combat value = easier to hit)
  getCombatModifier() {
    return -1
  },

  componentActions: [
    {
      id: 'tekklar-conditioning',
      name: 'Tekklar Conditioning',
      abilityId: 'tekklar-conditioning',
      isAvailable: (player) => player.isHeroUnlocked() && !player.isHeroPurged(),
    },
  ],

  // Hero: Sh'val, Harbinger — TEKKLAR CONDITIONING
  // Simplified: choose a system with planets, place ground forces from reinforcements,
  // resolve ground combat, then return ships to reinforcements and purge hero.
  tekklarConditioning(ctx, player) {
    // Choose a system to target (must have planets with opponent ground forces)
    const targetableSystems = []
    for (const [systemId, systemData] of Object.entries(ctx.state.systems)) {
      const tile = ctx.game.res.getSystemTile(systemId) || ctx.game.res.getSystemTile(Number(systemId))
      if (!tile || !tile.planets || tile.planets.length === 0) {
        continue
      }
      // Must have at least one planet with opponent ground forces
      const hasOpponentForces = tile.planets.some(pId => {
        const pu = ctx.state.units[systemId]?.planets[pId] || []
        return pu.some(u => u.owner !== player.name && (u.type === 'infantry' || u.type === 'mech'))
      })
      if (hasOpponentForces) {
        targetableSystems.push(systemId)
      }
    }

    if (targetableSystems.length === 0) {
      ctx.log.add({
        template: 'Tekklar Conditioning: No valid target systems',
        args: {},
      })
      return
    }

    let targetSystem
    if (targetableSystems.length === 1) {
      targetSystem = targetableSystems[0]
    }
    else {
      const sysChoice = ctx.actions.choose(player, targetableSystems, {
        title: "Sh'val: Choose system to invade",
      })
      targetSystem = sysChoice[0]
    }

    const tile = ctx.game.res.getSystemTile(targetSystem) || ctx.game.res.getSystemTile(Number(targetSystem))
    const invasionPlanets = tile.planets.filter(pId => {
      const pu = ctx.state.units[targetSystem]?.planets[pId] || []
      return pu.some(u => u.owner !== player.name && (u.type === 'infantry' || u.type === 'mech'))
    })

    // Place ground forces from reinforcements on each target planet
    for (const planetId of invasionPlanets) {
      const countChoices = ['Place 1 infantry', 'Place 2 infantry', 'Place 3 infantry', 'Place 4 infantry', 'Place 5 infantry']
      const countChoice = ctx.actions.choose(player, countChoices, {
        title: `Sh'val: How many infantry to commit to ${planetId}?`,
      })
      const count = parseInt(countChoice[0].match(/\d+/)?.[0]) || 0
      for (let i = 0; i < count; i++) {
        ctx.game._addUnit(targetSystem, planetId, 'infantry', player.name)
      }
    }

    ctx.log.add({
      template: "Tekklar Conditioning: {player} invades system {system}",
      args: { player: player.name, system: targetSystem },
    })

    // Ground combat happens naturally when the tactical action processes
    // For the simplified hero, we just place the forces and purge

    // Return any ships in the target system to reinforcements (remove them)
    const systemUnits = ctx.state.units[targetSystem]
    if (systemUnits) {
      systemUnits.space = systemUnits.space.filter(u => u.owner !== player.name)
    }

    player.purgeHero()
    ctx.log.add({
      template: "{player} purges Sh'val, Harbinger",
      args: { player: player.name },
    })
  },

  // Commander G'hom Sek'kus: +1 combat modifier (all combat types)
  commanderEffect: {
    timing: 'combat-modifier',
    apply: (_player, _context) => {
      return 1
    },
  },

  // Agent T'ro: At end of a player's tactical action, exhaust to place 2 infantry
  // on a planet that player controls in the active system
  onTacticalActionEnd(sardakkPlayer, ctx, { activatingPlayer, systemId }) {
    if (!sardakkPlayer.isAgentReady()) {
      return
    }

    // Check if activating player has any planets in the active system
    const tile = ctx.game.res.getSystemTile(systemId) || ctx.game.res.getSystemTile(Number(systemId))
    if (!tile || tile.planets.length === 0) {
      return
    }

    const controlledPlanets = tile.planets.filter(planetId => {
      const planetUnits = ctx.state.units[systemId]?.planets[planetId] || []
      return planetUnits.some(u => u.owner === activatingPlayer.name)
    })

    if (controlledPlanets.length === 0) {
      return
    }

    const choice = ctx.actions.choose(sardakkPlayer, ["Exhaust T'ro", 'Pass'], {
      title: "T'ro: Exhaust to place 2 infantry on a planet in the active system?",
    })

    if (choice[0] !== "Exhaust T'ro") {
      return
    }

    sardakkPlayer.exhaustAgent()

    // Choose which planet to place infantry on
    let targetPlanet
    if (controlledPlanets.length === 1) {
      targetPlanet = controlledPlanets[0]
    }
    else {
      const planetChoice = ctx.actions.choose(sardakkPlayer, controlledPlanets, {
        title: "T'ro: Choose planet for 2 infantry",
      })
      targetPlanet = planetChoice[0]
    }

    // Place 2 infantry belonging to the activating player
    for (let i = 0; i < 2; i++) {
      ctx.game._addUnit(systemId, targetPlanet, 'infantry', activatingPlayer.name)
    }

    ctx.log.add({
      template: "T'ro: {player} places 2 infantry on {planet} for {target}",
      args: { player: sardakkPlayer.name, planet: targetPlanet, target: activatingPlayer.name },
    })
  },

  // Exotrireme II: Cannot be destroyed by Direct Hit
  isDirectHitImmune(player, ctx, unit) {
    if (unit.type !== 'dreadnought' || unit.owner !== player.name) {
      return false
    }
    return player.hasTechnology('exotrireme-ii')
  },

  // Exotrireme II: After a round of space combat, may destroy this dreadnought
  // to destroy up to 2 ships in this system.
  afterSpaceCombatRound(player, ctx, { systemId, opponentName }) {
    if (!player.hasTechnology('exotrireme-ii')) {
      return
    }

    const systemUnits = ctx.state.units[systemId]
    if (!systemUnits) {
      return
    }

    const playerDreadnoughts = systemUnits.space.filter(
      u => u.owner === player.name && u.type === 'dreadnought'
    )

    if (playerDreadnoughts.length === 0) {
      return
    }

    const opponentShips = systemUnits.space.filter(u => u.owner === opponentName)
    if (opponentShips.length === 0) {
      return
    }

    const choice = ctx.actions.choose(player, ['Sacrifice Dreadnought', 'Pass'], {
      title: 'Exotrireme II: Destroy a dreadnought to destroy up to 2 enemy ships?',
    })

    if (choice[0] !== 'Sacrifice Dreadnought') {
      return
    }

    // Destroy the dreadnought
    const dread = playerDreadnoughts[0]
    const dreadIdx = systemUnits.space.findIndex(u => u.id === dread.id)
    if (dreadIdx !== -1) {
      systemUnits.space.splice(dreadIdx, 1)
      ctx.game.factionAbilities.onUnitDestroyed(systemId, dread, player.name, null)
    }

    ctx.log.add({
      template: 'Exotrireme II: {player} sacrifices a dreadnought',
      args: { player: player.name },
    })

    // Destroy up to 2 enemy ships (cheapest first)
    const remainingEnemies = systemUnits.space.filter(u => u.owner === opponentName)
    remainingEnemies.sort((a, b) => {
      const defA = ctx.game._getUnitStats(a.owner, a.type)
      const defB = ctx.game._getUnitStats(b.owner, b.type)
      return (defA?.cost || 0) - (defB?.cost || 0)
    })

    const toDestroy = Math.min(2, remainingEnemies.length)
    for (let i = 0; i < toDestroy; i++) {
      const victim = remainingEnemies[i]
      const victimIdx = systemUnits.space.findIndex(u => u.id === victim.id)
      if (victimIdx !== -1) {
        systemUnits.space.splice(victimIdx, 1)
        ctx.game.factionAbilities.onUnitDestroyed(systemId, victim, player.name, null)
        ctx.log.add({
          template: 'Exotrireme II: {player} destroys {ship}',
          args: { player: player.name, ship: victim.type },
        })
      }
    }
  },

  // Valkyrie Particle Weave (faction tech): After ground combat dice rolls,
  // if opponent produced hits, produce 1 additional hit.
  onGroundCombatRoundEnd(player, ctx, { systemId, planetId, opponentName, opponentHits }) {
    if (!player.hasTechnology('valkyrie-particle-weave')) {
      return
    }

    if (!opponentHits || opponentHits <= 0) {
      return
    }

    // Opponent produced hits, so Sardakk produces 1 additional hit
    ctx.game._assignGroundHits(systemId, planetId, opponentName, 1, player.name)

    ctx.log.add({
      template: 'Valkyrie Particle Weave: {player} produces 1 additional hit',
      args: { player: player.name },
    })
  },

  // N'orr Supremacy faction tech: after winning combat, gain 1 command token or research unit upgrade
  onCombatWon(player, ctx, { systemId: _systemId, loserName: _loserName, combatType: _combatType }) {
    if (!player.hasTechnology('norr-supremacy')) {
      return
    }

    const choices = ['Gain Command Token', 'Pass']

    // Check if player has any unit upgrade techs available to research
    const availableUpgrades = ctx.game._getResearchableTechs?.(player)
      ?.filter(t => t.unitUpgrade) || []
    if (availableUpgrades.length > 0) {
      choices.splice(1, 0, 'Research Unit Upgrade')
    }

    const choice = ctx.actions.choose(player, choices, {
      title: "N'orr Supremacy: Choose reward for winning combat",
    })

    if (choice[0] === 'Gain Command Token') {
      const poolChoice = ctx.actions.choose(player, ['tactics', 'fleet', 'strategy'], {
        title: 'Place command token in:',
      })
      player.commandTokens[poolChoice[0]]++
      ctx.log.add({
        template: "N'orr Supremacy: {player} gains 1 command token in {pool}",
        args: { player: player.name, pool: poolChoice[0] },
      })
    }
    else if (choice[0] === 'Research Unit Upgrade') {
      const upgradeChoices = availableUpgrades.map(t => t.id)
      const techChoice = ctx.actions.choose(player, upgradeChoices, {
        title: "N'orr Supremacy: Research a unit upgrade technology",
      })
      ctx.game._researchTech(player, techChoice[0])
      ctx.log.add({
        template: "N'orr Supremacy: {player} researches {tech}",
        args: { player: player.name, tech: techChoice[0] },
      })
    }
  },
}
