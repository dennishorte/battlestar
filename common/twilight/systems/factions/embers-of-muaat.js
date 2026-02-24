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
    {
      id: 'umbat-agent',
      name: 'Umbat',
      abilityId: 'star-forge',
      isAvailable: function(player) {
        return player.isAgentReady()
      },
    },
  ],

  // Agent — Umbat: ACTION: Exhaust to choose a player; that player may produce
  // up to 2 units that each have a cost of 4 or less in a system that contains
  // one of their war suns or their flagship.
  umbatAgent(ctx, player) {
    player.exhaustAgent()

    // Choose a target player (can be self)
    const allPlayers = ctx.game.players.all()
    const targetNames = allPlayers.map(p => p.name)
    const targetSelection = ctx.actions.choose(player, targetNames, {
      title: 'Umbat: Choose a player to produce units',
    })
    const targetPlayer = ctx.game.players.byName(targetSelection[0])

    // Find systems with target's war suns or flagship
    const eligibleSystems = []
    for (const [systemId, systemUnits] of Object.entries(ctx.state.units)) {
      const hasWarSunOrFlagship = systemUnits.space.some(
        u => u.owner === targetPlayer.name && (u.type === 'war-sun' || u.type === 'flagship')
      )
      if (hasWarSunOrFlagship) {
        eligibleSystems.push(systemId)
      }
    }

    if (eligibleSystems.length === 0) {
      ctx.log.add({
        template: 'Umbat: {target} has no war suns or flagships on the board',
        args: { target: targetPlayer.name },
      })
      return
    }

    let targetSystem
    if (eligibleSystems.length === 1) {
      targetSystem = eligibleSystems[0]
    }
    else {
      const sysChoice = ctx.actions.choose(targetPlayer, eligibleSystems, {
        title: 'Umbat: Choose system to produce in',
      })
      targetSystem = sysChoice[0]
    }

    // Produce up to 2 units with cost <= 4
    const unitTypes = ['fighter', 'destroyer', 'infantry', 'mech']
    for (let i = 0; i < 2; i++) {
      const choices = ['Pass', ...unitTypes]
      const unitChoice = ctx.actions.choose(targetPlayer, choices, {
        title: `Umbat: Produce unit ${i + 1}/2 (cost 4 or less)`,
      })

      if (unitChoice[0] === 'Pass') {
        break
      }

      const unitType = unitChoice[0]
      const unitDef = ctx.game.res.getUnit(unitType)
      if (unitDef) {
        if (unitDef.category === 'ship') {
          ctx.game._addUnit(targetSystem, 'space', unitType, targetPlayer.name)
        }
        else {
          // Place ground force on a controlled planet in the system
          const tile = ctx.game.res.getSystemTile(targetSystem) || ctx.game.res.getSystemTile(Number(targetSystem))
          const controlledPlanet = tile?.planets?.find(
            pId => ctx.state.planets[pId]?.controller === targetPlayer.name
          )
          if (controlledPlanet) {
            ctx.game._addUnit(targetSystem, controlledPlanet, unitType, targetPlayer.name)
          }
        }
      }
    }

    ctx.log.add({
      template: 'Umbat: {player} allows {target} to produce units',
      args: { player: player.name, target: targetPlayer.name },
    })
  },

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

    // Mech DEPLOY — Ember Colossus: when Star Forge is used in this or adjacent
    // system, place 1 infantry from reinforcements with this mech
    this._emberColossusDeploy(ctx, player, targetSystem)
  },

  // Ember Colossus DEPLOY: after Star Forge, check for mechs in the target
  // system or adjacent systems and place 1 infantry with each
  _emberColossusDeploy(ctx, player, starForgeSystem) {
    const systemsToCheck = [starForgeSystem]
    const adjacentIds = ctx.game._getAdjacentSystems(starForgeSystem)
    systemsToCheck.push(...adjacentIds)

    for (const systemId of systemsToCheck) {
      const systemUnits = ctx.state.units[systemId]
      if (!systemUnits) {
        continue
      }

      // Check planets for mechs
      for (const [planetId, planetUnits] of Object.entries(systemUnits.planets || {})) {
        const mechs = planetUnits.filter(
          u => u.owner === player.name && u.type === 'mech'
        )
        if (mechs.length > 0) {
          // Place 1 infantry with each mech (each mech triggers separately)
          for (let i = 0; i < mechs.length; i++) {
            ctx.game._addUnit(systemId, planetId, 'infantry', player.name)
          }
          ctx.log.add({
            template: 'Ember Colossus: {player} places {count} infantry on {planet}',
            args: { player: player.name, count: mechs.length, planet: planetId },
          })
        }
      }
    }
  },

  // ---------------------------------------------------------------------------
  // Magmus Reactor (faction tech): Your ships can move into supernovas.
  // After you produce units in a system with a war sun or adjacent to a
  // supernova, gain 1 trade good.
  // ---------------------------------------------------------------------------

  canMoveIntoSupernovae(player, _ctx) {
    return player.hasTechnology('magmus-reactor')
  },

  afterProduction(player, ctx, { systemId }) {
    if (!player.hasTechnology('magmus-reactor')) {
      return
    }

    // Check if system contains a war sun owned by this player
    const systemUnits = ctx.state.units[systemId]
    const hasWarSun = systemUnits?.space.some(u => u.owner === player.name && u.type === 'war-sun')

    // Check if system is adjacent to a supernova
    const adjacentIds = ctx.game._getAdjacentSystems(systemId)
    const { Galaxy } = require('../../model/Galaxy.js')
    const galaxy = new Galaxy(ctx.game)
    const adjacentToSupernova = adjacentIds.some(adjId => galaxy.hasAnomaly(adjId, 'supernova'))

    if (hasWarSun || adjacentToSupernova) {
      player.addTradeGoods(1)
      ctx.log.add({
        template: 'Magmus Reactor: {player} gains 1 trade good',
        args: { player },
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
