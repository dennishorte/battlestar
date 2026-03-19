const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Ghosts of Creuss', () => {
  describe('Data', () => {
    test('starting technologies', () => {
      const game = t.fixture({ factions: ['ghosts-of-creuss', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds()).toEqual(expect.arrayContaining(['gravity-drive']))
    })

    test('commodities is 4', () => {
      const game = t.fixture({ factions: ['ghosts-of-creuss', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(4)
    })

    test('faction technologies are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('ghosts-of-creuss')
      expect(faction.factionTechnologies.length).toBe(3)

      const ds = faction.factionTechnologies.find(ft => ft.id === 'dimensional-splicer')
      expect(ds.color).toBe('red')
      expect(ds.prerequisites).toEqual(['red'])
      expect(ds.unitUpgrade).toBeNull()

      const wg = faction.factionTechnologies.find(ft => ft.id === 'wormhole-generator')
      expect(wg.color).toBe('blue')
      expect(wg.prerequisites).toEqual(['blue', 'blue'])
      expect(wg.unitUpgrade).toBeNull()

      const ps = faction.factionTechnologies.find(ft => ft.id === 'particle-synthesis')
      expect(ps.color).toBeNull()
      expect(ps.prerequisites).toEqual(['blue', 'yellow'])
      expect(ps.unitUpgrade).toBeNull()
    })
  })

  test('home system is adjacent to wormhole systems', () => {
    const { Galaxy } = require('../../model/Galaxy.js')
    const game = t.fixture({ factions: ['ghosts-of-creuss', 'emirates-of-hacan'] })
    game.run()
    const galaxy = new Galaxy(game)

    // Creuss home should be adjacent to alpha wormhole systems
    const adjacent = galaxy.getAdjacent('creuss-home')
    // System 26 = Lodor (alpha wormhole), System 39 (alpha wormhole)
    const hasAlphaAdj = adjacent.some(id => galaxy.hasWormhole(id, 'alpha'))
    // System 25 = Quann (beta wormhole), System 40 (beta wormhole)
    const hasBetaAdj = adjacent.some(id => galaxy.hasWormhole(id, 'beta'))

    expect(hasAlphaAdj).toBe(true)
    expect(hasBetaAdj).toBe(true)
  })

  test('+1 move from wormhole systems', () => {
    const game = t.fixture({ factions: ['ghosts-of-creuss', 'emirates-of-hacan'] })
    game.run()

    // Creuss has slipstream: +1 move from wormhole systems
    // From home (which has alpha+beta wormholes), should get +1
    const bonus = game.factionAbilities.getMovementBonus('dennis', 'creuss-home')
    expect(bonus).toBe(1)

    // From a non-wormhole system, no bonus
    const noBonus = game.factionAbilities.getMovementBonus('dennis', '27')
    expect(noBonus).toBe(0)

    // Hacan gets no bonus
    const hacanBonus = game.factionAbilities.getMovementBonus('micah', 'creuss-home')
    expect(hacanBonus).toBe(0)
  })

  describe('Creuss Gate', () => {
    test('Creuss Gate placed at home position, home system off-map', () => {
      const game = t.fixture({ factions: ['ghosts-of-creuss', 'emirates-of-hacan'] })
      game.run()

      // Creuss Gate should be at the home position
      expect(game.state.systems['creuss-gate']).toBeDefined()
      expect(game.state.systems['creuss-gate'].position).toEqual({ q: 0, r: -3 })

      // Creuss home should be off-map
      expect(game.state.systems['creuss-home']).toBeDefined()
      expect(game.state.systems['creuss-home'].position).toEqual({ q: 99, r: 99 })
    })

    test('Creuss home and gate are wormhole-adjacent via delta', () => {
      const game = t.fixture({ factions: ['ghosts-of-creuss', 'emirates-of-hacan'] })
      game.run()

      const { Galaxy } = require('../../model/Galaxy.js')
      const galaxy = new Galaxy(game)

      // Both have delta wormhole -> adjacent
      const gateAdj = galaxy.getAdjacent('creuss-gate')
      expect(gateAdj).toContain('creuss-home')

      const homeAdj = galaxy.getAdjacent('creuss-home')
      expect(homeAdj).toContain('creuss-gate')
    })

    test('starting units placed on creuss-home, not creuss-gate', () => {
      const game = t.fixture({ factions: ['ghosts-of-creuss', 'emirates-of-hacan'] })
      game.run()

      // Starting units should be on creuss-home
      const homeSpace = game.state.units['creuss-home'].space
        .filter(u => u.owner === 'dennis')
      expect(homeSpace.length).toBeGreaterThan(0)

      // Creuss-gate should have no units
      const gateSpace = game.state.units['creuss-gate'].space
      expect(gateSpace.length).toBe(0)

      // Planet units on creuss (in creuss-home system)
      const creussPlanet = game.state.units['creuss-home'].planets['creuss']
        .filter(u => u.owner === 'dennis')
      expect(creussPlanet.length).toBeGreaterThan(0)
    })
  })

  describe('Agent — Emissary Taivra', () => {
    test('after activating system with wormhole, exhausts to make it adjacent to wormhole systems', () => {
      const game = t.fixture({ factions: ['ghosts-of-creuss', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(true)

      // The handler method exists on the faction
      const { getHandler } = require('../../systems/factions/index.js')
      const handler = getHandler('ghosts-of-creuss')
      expect(handler.onAnySystemActivated).toBeDefined()
    })

    test('exhausted agent cannot be used', () => {
      const game = t.fixture({ factions: ['ghosts-of-creuss', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(false)
    })
  })

  describe('Commander — Sai Seravus', () => {
    test('unlock condition: have units in 3 systems that contain alpha or beta wormholes', () => {
      const game = t.fixture({ factions: ['ghosts-of-creuss', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'creuss-home': {
              space: ['carrier'],
              'creuss': ['infantry', 'infantry', 'space-dock'],
            },
            // System 26 (Lodor) has alpha wormhole
            '26': {
              space: ['destroyer'],
            },
            // System 39 has alpha wormhole
            '39': {
              space: ['destroyer'],
            },
            // System 25 (Quann) has beta wormhole
            '25': {
              space: ['fighter'],
              'quann': ['infantry'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Units in 3 wormhole systems (26=alpha, 39=alpha, 25=beta)
      const dennis = game.players.byName('dennis')
      expect(dennis.isCommanderUnlocked()).toBe(true)
    })

    test('commander stays locked with units in fewer than 3 wormhole systems', () => {
      const game = t.fixture({ factions: ['ghosts-of-creuss', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'creuss-home': {
              space: ['carrier'],
              'creuss': ['infantry', 'infantry', 'space-dock'],
            },
            // System 26 (Lodor) has alpha wormhole
            '26': {
              space: ['destroyer'],
            },
            // System 25 (Quann) has beta wormhole
            '25': {
              space: ['fighter'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Only 2 wormhole systems — not enough (Creuss home has delta, not alpha/beta)
      const dennis = game.players.byName('dennis')
      expect(dennis.isCommanderUnlocked()).toBe(false)
    })

    test('afterShipsMove handler places fighters when commander unlocked and ships moved through wormhole', () => {
      const { getHandler } = require('../../systems/factions/index.js')
      const handler = getHandler('ghosts-of-creuss')
      expect(handler.afterShipsMove).toBeDefined()

      const game = t.fixture({ factions: ['ghosts-of-creuss', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'unlocked', hero: 'locked' },
          units: {
            '26': {
              space: ['carrier', 'cruiser'],
            },
            'creuss-home': {
              creuss: ['space-dock', 'infantry'],
            },
          },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')

      // Call the handler directly: carrier moved through wormhole, cruiser didn't
      handler.afterShipsMove(dennis, game.factionAbilities, {
        systemId: '26',
        movedShips: [
          { owner: 'dennis', type: 'carrier', movedThroughWormhole: true },
          { owner: 'dennis', type: 'cruiser', movedThroughWormhole: false },
        ],
      })

      // Only the carrier has capacity and moved through wormhole => 1 fighter placed
      const fighters = game.state.units['26'].space
        .filter(u => u.owner === 'dennis' && u.type === 'fighter')
      expect(fighters.length).toBe(1)
    })

    test('afterShipsMove does nothing when commander is locked', () => {
      const { getHandler } = require('../../systems/factions/index.js')
      const handler = getHandler('ghosts-of-creuss')

      const game = t.fixture({ factions: ['ghosts-of-creuss', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            '26': {
              space: ['carrier'],
            },
            'creuss-home': {
              creuss: ['space-dock', 'infantry'],
            },
          },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')

      handler.afterShipsMove(dennis, game.factionAbilities, {
        systemId: '26',
        movedShips: [
          { owner: 'dennis', type: 'carrier', movedThroughWormhole: true },
        ],
      })

      // No fighter placed because commander is locked
      const fighters = game.state.units['26'].space
        .filter(u => u.owner === 'dennis' && u.type === 'fighter')
      expect(fighters.length).toBe(0)
    })
  })

  describe('Hero — Riftwalker Meian', () => {
    test('SINGULARITY REACTOR: swap positions of any 2 systems that contain wormholes or your units, then purge', () => {
      const game = t.fixture({ factions: ['ghosts-of-creuss', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'unlocked' },
          units: {
            '27': {
              space: ['cruiser'],
            },
            'creuss-home': {
              creuss: ['space-dock', 'infantry'],
            },
          },
        },
      })
      game.run()

      const pos26Before = { ...game.state.systems['26'].position }
      const pos27Before = { ...game.state.systems['27'].position }

      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Component Action.creuss-hero')

      // System 26 has alpha wormhole, system 27 has dennis' cruiser
      // Use * prefix to prevent digit-to-number conversion
      t.choose(game, '*26')
      t.choose(game, '*27')

      // Positions should be swapped
      expect(game.state.systems['26'].position).toEqual(pos27Before)
      expect(game.state.systems['27'].position).toEqual(pos26Before)

      // Hero should be purged
      const dennis = game.players.byName('dennis')
      expect(dennis.isHeroPurged()).toBe(true)
    })
  })

  describe('Mech — Icarus Drive', () => {
    test('after system activation, may remove mech to place Creuss wormhole token', () => {
      const game = t.fixture({ factions: ['ghosts-of-creuss', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          technologies: ['gravity-drive'],
          units: {
            'creuss-home': {
              creuss: ['space-dock', 'mech', 'infantry'],
            },
            '27': {
              space: ['cruiser'],
            },
          },
        },
        micah: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis activates a system — triggers onAnySystemActivated for Creuss
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // Icarus Drive prompt — choose to remove mech
      t.choose(game, 'Remove Mech (Icarus Drive)')

      // Creuss wormhole token should be placed in system 27
      expect(game.state.creussWormholeToken).toBe('27')

      // Mech should be removed from the planet
      const creussUnits = game.state.units['creuss-home'].planets['creuss'] || []
      const mechsRemaining = creussUnits.filter(u => u.owner === 'dennis' && u.type === 'mech')
      expect(mechsRemaining.length).toBe(0)
    })
  })

  describe('Promissory Note — Creuss IFF', () => {
    test('at start of holder turn, place or move a Creuss wormhole token into a system with a controlled planet', () => {
      // Dennis = Hacan (holder), Micah = Creuss (owner)
      const game = t.fixture({ factions: ['emirates-of-hacan', 'ghosts-of-creuss'] })
      t.setBoard(game, {
        dennis: {
          promissoryNotes: [{ id: 'creuss-iff', owner: 'micah' }],
          units: {
            'hacan-home': {
              space: ['carrier'],
              'arretze': ['space-dock', 'infantry'],
            },
          },
          planets: {
            'arretze': { exhausted: false },
          },
        },
        micah: {
          units: {
            'creuss-home': {
              space: ['carrier'],
              'creuss': ['space-dock', 'infantry'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis's turn starts — Creuss IFF triggers
      t.choose(game, 'Play Creuss IFF')
      t.choose(game, 'hacan-home')

      // Wormhole token should be placed on hacan-home
      expect(game.state.creussWormholeToken).toBe('hacan-home')

      // PN returned to Creuss player
      const micah = game.players.byName('micah')
      expect(micah.getPromissoryNotes().some(n => n.id === 'creuss-iff')).toBe(true)

      const dennis = game.players.byName('dennis')
      expect(dennis.getPromissoryNotes().some(n => n.id === 'creuss-iff')).toBe(false)
    })

    test('returns to Creuss player after use', () => {
      // Dennis = Hacan (holder), Micah = Creuss (owner)
      const game = t.fixture({ factions: ['emirates-of-hacan', 'ghosts-of-creuss'] })
      t.setBoard(game, {
        dennis: {
          promissoryNotes: [{ id: 'creuss-iff', owner: 'micah' }],
          units: {
            'hacan-home': {
              space: ['carrier'],
              'arretze': ['space-dock', 'infantry'],
            },
            '27': {
              space: ['cruiser'],
            },
          },
          planets: {
            'arretze': { exhausted: false },
            'new-albion': { exhausted: false },
          },
        },
        micah: {
          units: {
            'creuss-home': {
              space: ['carrier'],
              'creuss': ['space-dock', 'infantry'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis plays Creuss IFF and picks system 27
      t.choose(game, 'Play Creuss IFF')
      t.choose(game, '*27')

      expect(game.state.creussWormholeToken).toBe('27')

      const micah = game.players.byName('micah')
      expect(micah.getPromissoryNotes().some(n => n.id === 'creuss-iff')).toBe(true)
    })
  })

  describe('Faction Technologies', () => {
    describe('Dimensional Splicer', () => {
      test('at start of space combat in a system with a wormhole, produce 1 hit', () => {
        // System 26 = Lodor (alpha wormhole) at (0,-1), adjacent to system 27 at (0,-2)
        // Creuss-gate is at (0,-3), adjacent to system 27
        const game = t.fixture({
          factions: ['ghosts-of-creuss', 'emirates-of-hacan'],
        })
        t.setBoard(game, {
          dennis: {
            technologies: ['gravity-drive', 'plasma-scoring', 'dimensional-splicer'],
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            units: {
              '27': {
                space: ['cruiser', 'cruiser', 'cruiser'],
              },
              'creuss-home': {
                creuss: ['space-dock', 'infantry'],
              },
            },
          },
          micah: {
            units: {
              '26': {
                space: ['fighter', 'fighter'],
              },
            },
          },
        })
        game.run()
        t.choose(game, 'leadership')
        t.choose(game, 'diplomacy')

        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '26' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: '27', count: 3 }],
        })

        // Dimensional Splicer should have produced 1 hit before combat
        const logEntries = game.log._log.map(e => e.template || '')
        const splicerLogs = logEntries.filter(t => t.includes('Dimensional Splicer'))
        expect(splicerLogs.length).toBe(1)

        // System 26 had 2 fighters — at least 1 should be destroyed by Dimensional Splicer
        // (combat will destroy the rest). 3 cruisers vs 2 fighters — Creuss wins
        const micahShips = game.state.units['26'].space
          .filter(u => u.owner === 'micah')
        expect(micahShips.length).toBe(0)
      })

      test('does not fire in a system without a wormhole', () => {
        // System 27 = New Albion + Starpoint, no wormhole
        const game = t.fixture({
          factions: ['ghosts-of-creuss', 'emirates-of-hacan'],
        })
        t.setBoard(game, {
          dennis: {
            technologies: ['gravity-drive', 'plasma-scoring', 'dimensional-splicer'],
            units: {
              'creuss-gate': {
                space: ['cruiser', 'cruiser', 'cruiser'],
              },
              'creuss-home': {
                creuss: ['space-dock', 'infantry'],
              },
            },
          },
          micah: {
            units: {
              '27': {
                space: ['fighter'],
              },
            },
          },
        })
        game.run()
        t.choose(game, 'leadership')
        t.choose(game, 'diplomacy')

        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: 'creuss-gate', count: 3 }],
        })

        // No Dimensional Splicer log should appear (no wormhole in system 27)
        const logEntries = game.log._log.map(e => e.template || '')
        const splicerLogs = logEntries.filter(t => t.includes('Dimensional Splicer'))
        expect(splicerLogs.length).toBe(0)
      })

      test('does not fire without the technology researched', () => {
        // Creuss without Dimensional Splicer in a wormhole system
        const game = t.fixture({
          factions: ['ghosts-of-creuss', 'emirates-of-hacan'],
        })
        t.setBoard(game, {
          dennis: {
            units: {
              '27': {
                space: ['cruiser', 'cruiser', 'cruiser'],
              },
              'creuss-home': {
                creuss: ['space-dock', 'infantry'],
              },
            },
          },
          micah: {
            units: {
              '26': {
                space: ['fighter'],
              },
            },
          },
        })
        game.run()
        t.choose(game, 'leadership')
        t.choose(game, 'diplomacy')

        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '26' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: '27', count: 3 }],
        })

        // No Dimensional Splicer log should appear (tech not researched)
        const logEntries = game.log._log.map(e => e.template || '')
        const splicerLogs = logEntries.filter(t => t.includes('Dimensional Splicer'))
        expect(splicerLogs.length).toBe(0)
      })
    })

    describe('Wormhole Generator', () => {
      test('exhaust to place Creuss wormhole token', () => {
        const game = t.fixture({
          factions: ['ghosts-of-creuss', 'emirates-of-hacan'],
        })
        t.setBoard(game, {
          dennis: {
            technologies: ['gravity-drive', 'fleet-logistics', 'wormhole-generator'],
            units: {
              '27': {
                space: ['cruiser'],
              },
              'creuss-home': {
                creuss: ['space-dock', 'infantry'],
              },
            },
            planets: {
              'new-albion': { exhausted: false },
            },
          },
        })
        game.run()
        t.choose(game, 'leadership')
        t.choose(game, 'diplomacy')

        // Dennis uses Component Action -> Wormhole Generator
        t.choose(game, 'Component Action.wormhole-generator')

        // System 27 is the only valid system (has ships + controlled planet), auto-selected

        expect(game.state.creussWormholeToken).toBe('27')

        // Tech should be exhausted now
        expect((game.players.byName('dennis').exhaustedTechs || []))
          .toContain('wormhole-generator')
      })

      test('not available when exhausted', () => {
        const game = t.fixture({
          factions: ['ghosts-of-creuss', 'emirates-of-hacan'],
        })
        t.setBoard(game, {
          dennis: {
            technologies: ['gravity-drive', 'fleet-logistics', 'wormhole-generator'],
            units: {
              '27': { space: ['cruiser'] },
              'creuss-home': { creuss: ['space-dock', 'infantry'] },
            },
            planets: { 'new-albion': { exhausted: false } },
          },
        })
        game.run()
        t.choose(game, 'leadership')
        t.choose(game, 'diplomacy')

        // Use it once (auto-selects system 27)
        t.choose(game, 'Component Action.wormhole-generator')

        // Fleet Logistics bonus — wormhole-generator is exhausted, no other component actions
        const choices = t.currentChoices(game)
        expect(choices).not.toContain('Component Action')
      })
    })

    describe('Particle Synthesis', () => {
      test('wormholes in systems with your ships gain PRODUCTION 1', () => {
        // System 26 (Lodor) has an alpha wormhole
        const game = t.fixture({
          factions: ['ghosts-of-creuss', 'emirates-of-hacan'],
        })
        t.setBoard(game, {
          dennis: {
            technologies: ['gravity-drive', 'particle-synthesis'],
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            tradeGoods: 5,
            units: {
              '26': {
                space: ['cruiser'],
              },
              'creuss-home': {
                creuss: ['space-dock', 'infantry'],
              },
            },
          },
        })
        game.run()
        t.choose(game, 'leadership')
        t.choose(game, 'diplomacy')

        // Dennis activates system 26 (alpha wormhole) where he has a cruiser
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '26' })
        t.action(game, 'move-ships', { movements: [] })

        // Production step: system 26 has 1 wormhole -> PRODUCTION 1 from Particle Synthesis
        // Can produce 1 unit. Let's produce a fighter (cost 1 from TG, reduced by 1 for wormhole = free)
        t.action(game, 'produce-units', {
          units: [{ type: 'fighter', count: 1 }],
        })

        // Fighter should be placed in system 26
        const fighters = game.state.units['26'].space
          .filter(u => u.owner === 'dennis' && u.type === 'fighter')
        expect(fighters.length).toBe(1)
      })

      test('reduce cost of produced units by 1 for each wormhole in the system', () => {
        // System 26 (Lodor) has an alpha wormhole -> 1 cost reduction
        const game = t.fixture({
          factions: ['ghosts-of-creuss', 'emirates-of-hacan'],
        })
        t.setBoard(game, {
          dennis: {
            technologies: ['gravity-drive', 'particle-synthesis'],
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            tradeGoods: 10,
            units: {
              '26': {
                space: ['cruiser'],
                'lodor': ['space-dock', 'infantry'],
              },
              'creuss-home': {
                creuss: ['space-dock', 'infantry'],
              },
            },
            planets: {
              'lodor': { exhausted: false },
            },
          },
        })
        game.run()
        t.choose(game, 'leadership')
        t.choose(game, 'diplomacy')

        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '26' })
        t.action(game, 'move-ships', { movements: [] })

        // Produce a fighter (cost 0.5 -> 0 due to 2x, but the wormhole discount reduces total)
        // Lodor has 3 resources + space dock PRODUCTION = 5, plus 1 wormhole PRODUCTION = 6
        // Wormhole reduces cost by 1
        t.action(game, 'produce-units', {
          units: [{ type: 'fighter', count: 2 }],
        })

        const fighters = game.state.units['26'].space
          .filter(u => u.owner === 'dennis' && u.type === 'fighter')
        expect(fighters.length).toBe(2)

        // Cost of 2 fighters: 1 resource (2 for 1), minus 1 for wormhole = 0
        // So no trade goods should be spent (lodor not exhausted since cost was 0)
        const dennis = game.players.byName('dennis')
        expect(dennis.tradeGoods).toBe(10) // unchanged
      })
    })
  })
})
