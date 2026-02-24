module.exports = {
  // Unrelenting: +1 to all combat rolls (lower combat value = easier to hit)
  getCombatModifier() {
    return -1
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
