const t = require('../../testutil.js')


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
    test.todo('after a player activates a system with a non-delta wormhole, may exhaust to make that system adjacent to all wormhole systems')
    test.todo('exhausted agent cannot be used')
  })

  describe('Commander — Sai Seravus', () => {
    test.todo('unlock condition: have units in 3 systems that contain alpha or beta wormholes')
    test.todo('after ships move through wormholes, place 1 fighter with each capacity ship that moved through a wormhole')
  })

  describe('Hero — Riftwalker Meian', () => {
    test.todo('SINGULARITY REACTOR: swap positions of any 2 systems that contain wormholes or your units, then purge')
  })

  describe('Mech — Icarus Drive', () => {
    test.todo('DEPLOY: after any player activates a system, may remove this unit to place or move a Creuss wormhole token into that system')
  })

  describe('Promissory Note — Creuss IFF', () => {
    test.todo('at start of holder turn, place or move a Creuss wormhole token into a system with a controlled planet or a non-home system without opponent ships')
    test.todo('returns to Creuss player after use')
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
      test.todo('ACTION: exhaust to place or move a Creuss wormhole token into a system with a controlled planet or non-home system without opponent ships')
    })

    describe('Particle Synthesis', () => {
      test.todo('wormholes in systems with your ships gain PRODUCTION 1')
      test.todo('reduce cost of produced units by 1 for each wormhole in the system')
    })
  })
})
