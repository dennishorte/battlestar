module.exports = {
  componentActions: [
    {
      id: 'dark-matter-affinity',
      name: 'Dark Matter Affinity',
      abilityId: 'dark-matter-affinity',
      isAvailable: (player) => player.isHeroUnlocked() && !player.isHeroPurged(),
    },
  ],

  // Hero: Darktalon Treilla — DARK MATTER AFFINITY
  // No fleet limit for the rest of this game round. Purge at end of round.
  darkMatterAffinity(ctx, player) {
    if (!ctx.state.noFleetLimit) {
      ctx.state.noFleetLimit = {}
    }
    ctx.state.noFleetLimit[player.name] = true

    ctx.log.add({
      template: 'Dark Matter Affinity: {player} has no fleet limit this round',
      args: { player: player.name },
    })

    // Hero will be purged at the end of the status phase
    // (tracked via noFleetLimit state — purged during onStatusPhaseStart or status cleanup)
    player.purgeHero()
    ctx.log.add({
      template: '{player} purges Darktalon Treilla',
      args: { player: player.name },
    })
  },

  // Clean up noFleetLimit at the start of the next status phase
  onStatusPhaseStart(player, ctx) {
    if (ctx.state.noFleetLimit?.[player.name]) {
      delete ctx.state.noFleetLimit[player.name]
    }
  },

  onSpaceCombatRound(player, ctx, { systemId, opponentName: _opponentName }) {
    const systemUnits = ctx.state.units[systemId]
    const playerShips = systemUnits.space.filter(u => u.owner === player.name)
    if (playerShips.length === 0) {
      return
    }

    // Agent: Viscount Unlenn — exhaust to give 1 ship an additional combat die
    if (player.isAgentReady()) {
      const agentChoices = ['Exhaust Viscount Unlenn', 'Pass']
      const agentChoice = ctx.actions.choose(player, agentChoices, {
        title: 'Viscount Unlenn: Exhaust to give 1 ship +1 die this round?',
      })

      if (agentChoice[0] === 'Exhaust Viscount Unlenn') {
        player.exhaustAgent()

        // Choose which ship gets the bonus die
        let targetShip
        if (playerShips.length === 1) {
          targetShip = playerShips[0]
        }
        else {
          const shipChoices = playerShips.map((s, i) => ({
            label: s.type + (s.damaged ? ' (damaged)' : ''),
            value: i,
          }))
          const shipChoice = ctx.actions.choose(player, shipChoices.map(c => c.label), {
            title: 'Choose ship for +1 die:',
          })
          const idx = shipChoices.findIndex(c => c.label === shipChoice[0])
          targetShip = playerShips[idx >= 0 ? idx : 0]
        }

        targetShip.bonusDice = (targetShip.bonusDice || 0) + 1
        ctx.log.add({
          template: 'Viscount Unlenn: {player} gives {ship} +1 combat die',
          args: { player, ship: targetShip.type },
        })
      }
    }

    // Munitions Reserves: spend 2 TG to reroll dice
    if (player.tradeGoods >= 2) {
      const choice = ctx.actions.choose(player, ['Reroll', 'Pass'], {
        title: 'Munitions Reserves: Spend 2 trade goods to reroll dice?',
      })

      if (choice[0] === 'Reroll') {
        player.spendTradeGoods(2)
        ctx.log.add({
          template: '{player} spends 2 trade goods for Munitions Reserves reroll',
          args: { player },
        })
      }
    }
  },

  afterSpaceCombatRound(player, ctx, { systemId }) {
    // Clean up bonus dice after round resolves
    const systemUnits = ctx.state.units[systemId]
    if (systemUnits) {
      for (const ship of systemUnits.space) {
        if (ship.owner === player.name && ship.bonusDice) {
          delete ship.bonusDice
        }
      }
    }
  },

  // Mech — Dunlain Reaper DEPLOY: At the start of a ground combat,
  // you may spend 2 resources to replace 1 of your infantry on that planet with 1 mech.
  onGroundCombatStart(player, ctx, { systemId, planetId, opponentName: _opponentName }) {
    const planetUnits = ctx.state.units[systemId]?.planets[planetId] || []
    const playerInfantry = planetUnits.filter(u => u.owner === player.name && u.type === 'infantry')

    if (playerInfantry.length === 0) {
      return
    }

    // Check if player can afford 2 resources (ready planets + trade goods)
    const totalResources = player.getTotalResources() + player.tradeGoods
    if (totalResources < 2) {
      return
    }

    if (!ctx.game._hasReinforcementsAvailable(player.name, 'mech')) {
      return
    }

    const choice = ctx.actions.choose(player, ['Deploy Mech', 'Pass'], {
      title: 'Dunlain Reaper: Spend 2 resources to replace 1 infantry with 1 mech?',
    })

    if (choice[0] === 'Pass') {
      return
    }

    // Pay 2 resources — spend trade goods first, then exhaust planets
    let remaining = 2
    if (player.tradeGoods > 0) {
      const fromTG = Math.min(player.tradeGoods, remaining)
      player.spendTradeGoods(fromTG)
      remaining -= fromTG
    }
    if (remaining > 0) {
      ctx.game._payInfluence(player, 0) // no-op, just in case
      // Exhaust planets to cover remaining resource cost
      const readyPlanets = player.getReadyPlanets()
        .map(pId => {
          const planet = ctx.game.res.getPlanet(pId)
          return { id: pId, resources: planet?.resources || 0 }
        })
        .sort((a, b) => a.resources - b.resources)

      for (const planet of readyPlanets) {
        if (remaining <= 0) {
          break
        }
        ctx.state.planets[planet.id].exhausted = true
        remaining -= planet.resources
      }
    }

    // Replace 1 infantry with 1 mech
    const infIdx = planetUnits.findIndex(u => u.owner === player.name && u.type === 'infantry')
    if (infIdx !== -1) {
      planetUnits.splice(infIdx, 1)
      ctx.game._addUnitToPlanet(systemId, planetId, 'mech', player.name)
    }

    ctx.log.add({
      template: 'Dunlain Reaper: {player} spends 2 resources to deploy mech (replacing infantry)',
      args: { player: player.name },
    })
  },

  // Commander: Rear Admiral Farran — gain 1 TG after sustain damage
  onUnitsSustainedDamage(player, ctx, { systemId: _systemId, count }) {
    if (!player.isCommanderUnlocked()) {
      return
    }

    for (let i = 0; i < count; i++) {
      player.addTradeGoods(1)
    }

    ctx.log.add({
      template: 'Rear Admiral Farran: {player} gains {count} trade good(s)',
      args: { player, count },
    })
  },

  commanderEffect: {
    timing: 'spend-token-alternative',
    apply: (player, _context) => {
      return player.tradeGoods >= 2
    },
  },

  // Gravleash Maneuvers (faction tech): +X to combat rolls during space combat,
  // where X is the number of different ship types you have in the combat.
  getSpaceCombatModifier(player, ctx, systemId) {
    if (!player.hasTechnology('gravleash-maneuvers')) {
      return 0
    }

    const systemUnits = ctx.state.units[systemId]
    if (!systemUnits) {
      return 0
    }

    const playerShips = systemUnits.space.filter(u => u.owner === player.name)
    if (playerShips.length === 0) {
      return 0
    }
    const shipTypes = new Set(playerShips.map(u => u.type))
    // +X to result means lower combat value (easier to hit) → return negative modifier
    return -shipTypes.size
  },

  // L4 Disruptors (faction tech): During an invasion, units cannot use SPACE CANNON
  // against your units.
  isSpaceCannonImmuneDuringInvasion(player, _ctx) {
    return player.hasTechnology('l4-disruptors')
  },

  // Non-Euclidean Shielding (faction tech): When 1 of your units uses SUSTAIN DAMAGE,
  // cancel 2 hits instead of 1.
  getSustainDamageHitsCancel(player, _ctx) {
    if (player.hasTechnology('non-euclidean-shielding')) {
      return 2
    }
    return 1
  },
}
