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

  // ---------------------------------------------------------------------------
  // Specialized Compounds — faction tech
  // When researching via Technology strategy card, exhausted tech specialty
  // planets still count as prerequisites (they normally only count when ready).
  // This is implemented via getTechPrerequisiteBonuses, which adds bonus
  // prerequisites for exhausted specialty planets.
  // ---------------------------------------------------------------------------
  getTechPrerequisiteBonuses(player, ctx) {
    if (!player.hasTechnology('specialized-compounds')) {
      return {}
    }

    const res = require('../../res/index.js')
    const bonuses = {}
    const controlledPlanets = player.getControlledPlanets()

    for (const planetId of controlledPlanets) {
      const planet = res.getPlanet(planetId)
      if (!planet?.techSpecialty) {
        continue
      }

      // Only add bonus for EXHAUSTED specialty planets (non-exhausted already count)
      // Exception: if player has Psychoarchaeology, exhausted planets already count too
      const isExhausted = ctx.state?.planets?.[planetId]?.exhausted
      const hasPsychoarchaeology = player.hasTechnology('psychoarchaeology')

      if (isExhausted && !hasPsychoarchaeology) {
        bonuses[planet.techSpecialty] = (bonuses[planet.techSpecialty] || 0) + 1
      }
    }

    return bonuses
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

  // Shield Paling mech: infantry on this planet are not affected by Fragile (+1 combat)
  getGroundCombatUnitModifier(player, ctx, unit, systemId, planetId) {
    if (unit.type !== 'infantry' || unit.owner !== player.name) {
      return 0
    }
    // Check if there's a Jol-Nar mech on the same planet
    const planetUnits = ctx.state.units[systemId]?.planets[planetId] || []
    const hasMech = planetUnits.some(u => u.owner === player.name && u.type === 'mech')
    if (hasMech) {
      return -1 // Negates the +1 Fragile penalty
    }
    return 0
  },

  // E-Res Siphons (faction tech): After activating a system that contains your
  // units, gain 4 trade goods.
  onSystemActivated(player, ctx, systemId) {
    // E-Res Siphons
    if (player.hasTechnology('e-res-siphons')) {
      const systemUnits = ctx.state.units[systemId]
      if (systemUnits) {
        const hasShips = systemUnits.space.some(u => u.owner === player.name)
        let hasPlanetUnits = false
        if (!hasShips && systemUnits.planets) {
          for (const planetId of Object.keys(systemUnits.planets)) {
            if (systemUnits.planets[planetId].some(u => u.owner === player.name)) {
              hasPlanetUnits = true
              break
            }
          }
        }

        if (hasShips || hasPlanetUnits) {
          player.addTradeGoods(4)
          ctx.log.add({
            template: 'E-Res Siphons: {player} gains 4 trade goods',
            args: { player: player.name },
          })
        }
      }
    }

    // Spatial Conduit Cylinder: after activating a system with own units,
    // that system is adjacent to all other systems with own units
    if (player.hasTechnology('spatial-conduit-cylinder')) {
      if ((player.exhaustedTechs || []).includes('spatial-conduit-cylinder')) {
        return
      }

      const systemUnits = ctx.state.units[systemId]
      if (!systemUnits) {
        return
      }

      const hasShips = systemUnits.space.some(u => u.owner === player.name)
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

      // Ask if player wants to exhaust Spatial Conduit Cylinder
      const choice = ctx.actions.choose(player, ['Exhaust Spatial Conduit Cylinder', 'Pass'], {
        title: 'Spatial Conduit Cylinder: Make this system adjacent to all your other systems?',
      })

      if (choice[0] !== 'Exhaust Spatial Conduit Cylinder') {
        return
      }

      ctx.game._exhaustTech(player, 'spatial-conduit-cylinder')

      // Find all systems with this player's units
      const adjacentSystems = []
      for (const [otherSystemId, otherSystemUnits] of Object.entries(ctx.state.units)) {
        if (String(otherSystemId) === String(systemId)) {
          continue
        }
        const otherHasShips = otherSystemUnits.space.some(u => u.owner === player.name)
        let otherHasPlanetUnits = false
        if (!otherHasShips && otherSystemUnits.planets) {
          for (const pId of Object.keys(otherSystemUnits.planets)) {
            if (otherSystemUnits.planets[pId].some(u => u.owner === player.name)) {
              otherHasPlanetUnits = true
              break
            }
          }
        }
        if (otherHasShips || otherHasPlanetUnits) {
          adjacentSystems.push(String(otherSystemId))
        }
      }

      if (adjacentSystems.length > 0) {
        if (!ctx.state.temporaryAdjacency) {
          ctx.state.temporaryAdjacency = []
        }
        ctx.state.temporaryAdjacency.push({
          systemId: String(systemId),
          adjacentTo: adjacentSystems,
        })

        ctx.log.add({
          template: 'Spatial Conduit Cylinder: {player} makes system {system} adjacent to {count} systems',
          args: { player: player.name, system: systemId, count: adjacentSystems.length },
        })
      }
    }
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

  // ---------------------------------------------------------------------------
  // Component Actions
  // ---------------------------------------------------------------------------

  componentActions: [
    {
      id: 'jolnar-hero',
      name: "Rin, The Master's Legacy",
      abilityId: 'fragile',  // reuse faction ability ID for availability gate
      isAvailable: function(player) {
        return player.isHeroUnlocked() && !player.isHeroPurged()
      },
    },
  ],

  // Rin, The Master's Legacy — GENETIC MEMORY
  // ACTION: For each non-unit-upgrade technology you own, you may replace
  // that technology with any technology of the same color from the deck.
  // Then, purge this card.
  jolnarHero(ctx, player) {
    const res = require('../../res/index.js')

    const ownedTechs = player.getTechIds()
    const nonUpgradeTechs = ownedTechs.filter(id => {
      const tech = res.getTechnology(id)
      return tech && !tech.unitUpgrade && tech.color
    })

    if (nonUpgradeTechs.length === 0) {
      player.purgeHero()
      ctx.log.add({
        template: '{player} purges Rin but has no replaceable technologies',
        args: { player: player.name },
      })
      return
    }

    // For each non-unit-upgrade tech, offer to replace
    const replacements = []
    for (const techId of nonUpgradeTechs) {
      const currentTech = res.getTechnology(techId)
      if (!currentTech || !currentTech.color) {
        continue
      }

      // Find available techs of the same color that the player doesn't own
      const available = res.getGenericTechnologies()
        .filter(t => t.color === currentTech.color && !player.hasTechnology(t.id) && !t.unitUpgrade)
        .map(t => t.id)

      // Also check faction technologies of the same color
      if (player.faction?.factionTechnologies) {
        for (const ft of player.faction.factionTechnologies) {
          if (ft.color === currentTech.color && !player.hasTechnology(ft.id) && !ft.unitUpgrade) {
            available.push(ft.id)
          }
        }
      }

      if (available.length === 0) {
        continue
      }

      const choices = ['Keep', ...available]
      const selection = ctx.actions.choose(player, choices, {
        title: `Genetic Memory: Replace ${currentTech.name} (${currentTech.color})?`,
      })

      if (selection[0] !== 'Keep') {
        replacements.push({ from: techId, to: selection[0] })
      }
    }

    // Execute replacements
    const { BaseCard } = require('../../../lib/game/index.js')

    for (const { from, to } of replacements) {
      // Remove old tech
      const techZone = ctx.game.zones.byPlayer(player, 'technologies')
      const cardId = `${player.name}-${from}`
      const cards = techZone.cardlist()
      const card = cards.find(c => c.id === cardId)
      if (card) {
        techZone.remove(card)
      }

      // Add new tech
      const newTech = res.getTechnology(to)
      if (newTech) {
        const newCardId = `${player.name}-${to}`
        let card
        try {
          card = ctx.game.cards.byId(newCardId)
        }
        catch { /* not registered yet */ }
        if (!card) {
          card = new BaseCard(ctx.game, { id: newCardId, ...newTech })
          ctx.game.cards.register(card)
        }
        techZone.push(card, techZone.nextIndex())
      }

      ctx.log.add({
        template: 'Genetic Memory: {player} replaces {from} with {to}',
        args: { player: player.name, from, to },
      })
    }

    player.purgeHero()
    ctx.log.add({
      template: "{player} purges Rin, The Master's Legacy",
      args: { player: player.name },
    })
  },
}
