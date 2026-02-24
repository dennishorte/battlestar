module.exports = {
  getCombatModifier() {
    return 1
  },

  getTechPrerequisiteSkips(player, ctx, tech) {
    let skips = 0
    // Analytical: skip 1 prereq for non-unit-upgrade techs
    if (!tech.unitUpgrade) {
      skips += 1
    }
    // Brilliant: skip 1 more prereq (need 2+ techs, non-unit-upgrade only)
    if (!tech.unitUpgrade && (player.getTechIds?.()?.length ?? 0) >= 2) {
      skips += 1
    }
    return skips
  },

  onTechResearched(player, ctx, tech) {
    // Check if brilliant was actually needed (deficit > analytical skips)
    const prereqs = player.getTechPrerequisites()
    const needed = {}
    for (const color of tech.prerequisites) {
      needed[color] = (needed[color] || 0) + 1
    }

    const analyticalSkips = tech.unitUpgrade ? 0 : 1

    let deficit = 0
    for (const [color, count] of Object.entries(needed)) {
      const shortfall = count - (prereqs[color] || 0)
      if (shortfall > 0) {
        deficit += shortfall
      }
    }

    if (deficit <= analyticalSkips) {
      return
    }

    const techIds = player.getTechIds().filter(id => {
      return !(player.exhaustedTechs || []).includes(id)
    })
    if (techIds.length < 2) {
      return
    }

    for (let i = 0; i < 2; i++) {
      const available = player.getTechIds().filter(id => {
        return !(player.exhaustedTechs || []).includes(id)
      })
      const selection = ctx.actions.choose(player, available, {
        title: `Brilliant: Exhaust technology (${i + 1}/2)`,
      })
      if (!player.exhaustedTechs) {
        player.exhaustedTechs = []
      }
      player.exhaustedTechs.push(selection[0])
    }

    ctx.log.add({
      template: '{player} exhausts 2 technologies (Brilliant)',
      args: { player },
    })
  },

  // E-Res Siphons (faction tech): After activating a system that contains your
  // units, gain 4 trade goods.
  onSystemActivated(player, ctx, systemId) {
    if (!player.hasTechnology('e-res-siphons')) {
      return
    }

    const systemUnits = ctx.state.units[systemId]
    if (!systemUnits) {
      return
    }

    // Check for own units in space
    const hasShips = systemUnits.space.some(u => u.owner === player.name)

    // Check for own units on planets
    let hasPlanetUnits = false
    if (!hasShips && systemUnits.planets) {
      for (const planetId of Object.keys(systemUnits.planets)) {
        if (systemUnits.planets[planetId].some(u => u.owner === player.name)) {
          hasPlanetUnits = true
          break
        }
      }
    }

    if (!hasShips && !hasPlanetUnits) {
      return
    }

    player.addTradeGoods(4)
    ctx.log.add({
      template: 'E-Res Siphons: {player} gains 4 trade goods',
      args: { player: player.name },
    })
  },

  // Agent — Doctor Sucaban: After a player researches a technology, exhaust to
  // allow that player to spend 2 influence to draw 2 action cards.
  onAnyTechResearched(jolNarPlayer, ctx, { researchingPlayer, tech: _tech }) {
    if (!jolNarPlayer.isAgentReady()) {
      return
    }

    const choice = ctx.actions.choose(jolNarPlayer, ['Exhaust Doctor Sucaban', 'Pass'], {
      title: `Doctor Sucaban: ${researchingPlayer.name} researched a technology. Exhaust agent?`,
    })

    if (choice[0] !== 'Exhaust Doctor Sucaban') {
      return
    }

    // Re-fetch the researching player in case reference went stale
    const targetPlayer = ctx.players.byName(researchingPlayer.name)

    // Check if target player has at least 2 influence available
    if (targetPlayer.getTotalInfluence() < 2) {
      jolNarPlayer.exhaustAgent()
      ctx.log.add({
        template: 'Doctor Sucaban: {player} exhausts agent but {target} has insufficient influence',
        args: { player: jolNarPlayer.name, target: targetPlayer.name },
      })
      return
    }

    jolNarPlayer.exhaustAgent()

    // Target player chooses planets to exhaust for 2 influence
    const readyPlanets = targetPlayer.getReadyPlanets()
    const planetChoices = readyPlanets.map(pId => {
      const planet = ctx.game.res.getPlanet(pId)
      return `${pId} (${planet ? planet.influence : 0})`
    })

    let influenceSpent = 0
    while (influenceSpent < 2 && planetChoices.length > 0) {
      const remaining = 2 - influenceSpent
      const selection = ctx.actions.choose(targetPlayer, planetChoices, {
        title: `Doctor Sucaban: Exhaust planets for influence (${remaining} more needed)`,
      })

      const planetId = selection[0].split(' (')[0]
      const planet = ctx.game.res.getPlanet(planetId)
      if (planet) {
        influenceSpent += planet.influence
        ctx.state.planets[planetId].exhausted = true
      }

      // Remove the exhausted planet from choices
      const idx = planetChoices.indexOf(selection[0])
      if (idx !== -1) {
        planetChoices.splice(idx, 1)
      }
    }

    // Draw 2 action cards
    ctx.game._drawActionCards(targetPlayer, 2)

    ctx.log.add({
      template: 'Doctor Sucaban: {target} spends influence to draw 2 action cards',
      args: { player: jolNarPlayer.name, target: targetPlayer.name },
    })
  },
}
