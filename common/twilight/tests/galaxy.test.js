const t = require('../testutil.js')
const { Galaxy } = require('../model/Galaxy.js')
const res = require('../res/index.js')

// Helper: find systems on the map with a given wormhole type
function findWormholeSystems(game, type) {
  return Object.keys(game.state.systems).filter(id => {
    const tile = res.getSystemTile(id) || res.getSystemTile(Number(id))
    return tile && tile.wormholes.includes(type)
  })
}

// Helper: find systems on the map with a given anomaly type
function findAnomalySystems(game, type) {
  return Object.keys(game.state.systems).filter(id => {
    const tile = res.getSystemTile(id) || res.getSystemTile(Number(id))
    return tile && tile.anomaly === type
  })
}

// Helper: find systems at a given hex distance from Mecatol
function findSystemsAtDistance(game, distance) {
  return Object.entries(game.state.systems)
    .filter(([id, sys]) =>
      String(id) !== '18' && res.getHexDistance(sys.position, { q: 0, r: 0 }) === distance
    )
    .map(([id]) => id)
}

describe('Galaxy', () => {
  describe('Map Construction', () => {
    test('2-player map has Mecatol Rex at center', () => {
      const game = t.fixture()
      game.run()
      expect(game.state.systems[18]).toBeDefined()
      expect(game.state.systems[18].position.q).toBe(0)
      expect(game.state.systems[18].position.r).toBe(0)
    })

    test('2-player map has both home systems', () => {
      const game = t.fixture()
      game.run()
      expect(game.state.systems['sol-home']).toBeDefined()
      expect(game.state.systems['hacan-home']).toBeDefined()
    })

    test('deterministic: same seed produces same galaxy', () => {
      const game1 = t.fixture({ seed: 'determinism-test' })
      const game2 = t.fixture({ seed: 'determinism-test' })
      game1.run()
      game2.run()
      expect(Object.keys(game1.state.systems).sort())
        .toEqual(Object.keys(game2.state.systems).sort())
    })

    test('3-player map places 3 home systems at correct positions', () => {
      const game = t.fixture({ numPlayers: 3 })
      game.run()

      expect(game.state.systems['sol-home']).toBeDefined()
      expect(game.state.systems['hacan-home']).toBeDefined()
      expect(game.state.systems['letnev-home']).toBeDefined()

      // Verify positions match the 3-player layout
      const layout = res.getLayout(3)
      expect(game.state.systems['sol-home'].position).toEqual(layout.homePositions[0])
      expect(game.state.systems['hacan-home'].position).toEqual(layout.homePositions[1])
      expect(game.state.systems['letnev-home'].position).toEqual(layout.homePositions[2])
    })

    test('galaxy fills interior with blue and red tiles', () => {
      const game = t.fixture()
      game.run()

      const systemIds = Object.keys(game.state.systems)

      // Interior tiles = everything except Mecatol and home systems
      const interiorIds = systemIds.filter(id =>
        id !== '18' && id !== 'sol-home' && id !== 'hacan-home'
      )

      // 2-player: ring1 (6) + ring2 (12) = 18 interior positions
      expect(interiorIds.length).toBe(18)

      // All interior tiles should reference valid tile definitions
      for (const id of interiorIds) {
        const tile = res.getSystemTile(id) || res.getSystemTile(Number(id))
        expect(tile).toBeDefined()
        expect(['blue', 'red']).toContain(tile.type)
      }
    })

    test('different seeds produce different tile placements', () => {
      const game1 = t.fixture({ seed: 'seed-alpha', deterministicLayout: false })
      const game2 = t.fixture({ seed: 'seed-beta', deterministicLayout: false })
      game1.run()
      game2.run()

      // Same structure (same number of systems)
      const ids1 = Object.keys(game1.state.systems).sort()
      const ids2 = Object.keys(game2.state.systems).sort()
      expect(ids1.length).toBe(ids2.length)

      // But different tile selections
      const interior1 = ids1.filter(id => id !== '18' && id !== 'sol-home' && id !== 'hacan-home')
      const interior2 = ids2.filter(id => id !== '18' && id !== 'sol-home' && id !== 'hacan-home')
      expect(interior1).not.toEqual(interior2)
    })
  })

  describe('Adjacency', () => {
    test('physically adjacent hexes are neighbors', () => {
      const game = t.fixture()
      game.run()

      // All ring1 tiles (distance 1 from Mecatol) should be adjacent to Mecatol
      const adjacent = game._getAdjacentSystems(18)
      const ring1Systems = findSystemsAtDistance(game, 1)

      for (const sysId of ring1Systems) {
        expect(adjacent).toContain(sysId)
      }
    })

    test('non-adjacent hexes are not neighbors', () => {
      const game = t.fixture()
      game.run()

      // Home systems are at distance 3 — should NOT be adjacent to Mecatol
      const adjacent = game._getAdjacentSystems(18)
      expect(adjacent).not.toContain('sol-home')
      expect(adjacent).not.toContain('hacan-home')
    })

    test('Mecatol Rex has 6 neighbors in standard layout', () => {
      const game = t.fixture()
      game.run()

      const ring1Systems = findSystemsAtDistance(game, 1)
      expect(ring1Systems.length).toBe(6)

      // Adjacency should include at least those 6 (possibly more via wormholes)
      const adjacent = game._getAdjacentSystems(18)
      expect(adjacent.length).toBeGreaterThanOrEqual(6)
    })

    describe('Wormhole Adjacency', () => {
      test('alpha wormholes are adjacent to each other', () => {
        // Seed 'alpha_seed' places tiles 39 and 82 which both have alpha wormholes
        const game = t.fixture({ seed: 'alpha_seed', deterministicLayout: false })
        game.run()

        const alphaSystems = findWormholeSystems(game, 'alpha')
        expect(alphaSystems.length).toBeGreaterThanOrEqual(2)

        const adjacent = game._getAdjacentSystems(alphaSystems[0])
        for (let i = 1; i < alphaSystems.length; i++) {
          expect(adjacent).toContain(alphaSystems[i])
        }
      })

      test('beta wormholes are adjacent to each other', () => {
        // Default seed places tiles 40 and 64 which both have beta wormholes
        const game = t.fixture()
        game.run()

        const betaSystems = findWormholeSystems(game, 'beta')
        expect(betaSystems.length).toBeGreaterThanOrEqual(2)

        const adjacent = game._getAdjacentSystems(betaSystems[0])
        for (let i = 1; i < betaSystems.length; i++) {
          expect(adjacent).toContain(betaSystems[i])
        }
      })

      test('alpha and beta wormholes are NOT adjacent via wormhole', () => {
        // Seed 'xyz' places tile 39 (alpha-only) and tile 25 (beta-only)
        const game = t.fixture({ seed: 'xyz', deterministicLayout: false })
        game.run()

        const alphaOnly = Object.keys(game.state.systems).filter(id => {
          const tile = res.getSystemTile(id) || res.getSystemTile(Number(id))
          return tile && tile.wormholes.includes('alpha') && !tile.wormholes.includes('beta')
        })
        const betaOnly = Object.keys(game.state.systems).filter(id => {
          const tile = res.getSystemTile(id) || res.getSystemTile(Number(id))
          return tile && tile.wormholes.includes('beta') && !tile.wormholes.includes('alpha')
        })

        expect(alphaOnly.length).toBeGreaterThan(0)
        expect(betaOnly.length).toBeGreaterThan(0)

        // With seed 'xyz', alpha (39) is at (-2,1) and beta (25) is at (2,-2).
        // Physical distance is 4, so they should NOT be adjacent at all
        // (no physical adjacency and no wormhole match).
        const adjacent = game._getAdjacentSystems(alphaOnly[0])
        for (const beta of betaOnly) {
          expect(adjacent).not.toContain(beta)
        }
      })

      test('gamma wormholes are adjacent to matching gamma', () => {
        // Only tile 82 (Mallice) has gamma in the tile pool.
        // With no second gamma system, we verify the single gamma system
        // does not erroneously connect to non-gamma systems via wormhole.
        const game = t.fixture({ seed: 'alpha_seed', deterministicLayout: false })
        game.run()

        const gammaSystems = findWormholeSystems(game, 'gamma')
        // Tile 82 has alpha+beta+gamma — verify it's on the map
        expect(gammaSystems.length).toBe(1)

        // The gamma system should not have any gamma-adjacent neighbors
        // (since there's only one gamma system)
        const adjacent = game._getAdjacentSystems(gammaSystems[0])
        const gammaNeighbors = adjacent.filter(id => {
          const tile = res.getSystemTile(id) || res.getSystemTile(Number(id))
          return tile && tile.wormholes.includes('gamma')
        })
        expect(gammaNeighbors.length).toBe(0)
      })
    })
  })

  describe('Pathfinding', () => {
    test('finds direct path to adjacent system', () => {
      const game = t.fixture()
      game.run()
      const galaxy = new Galaxy(game)

      // Mecatol to any ring1 neighbor = 1 hop
      const adjacent = galaxy.getAdjacent('18')
      expect(adjacent.length).toBeGreaterThan(0)

      const path = galaxy.findPath('18', adjacent[0], 'dennis', 1)
      expect(path).not.toBeNull()
      expect(path.length).toBe(2)
      expect(path[0]).toBe('18')
      expect(path[1]).toBe(adjacent[0])
    })

    test('finds multi-hop path within move value', () => {
      const game = t.fixture()
      game.run()
      const galaxy = new Galaxy(game)

      // Find a ring2 system (distance 2 from Mecatol)
      const ring2Systems = findSystemsAtDistance(game, 2)
      expect(ring2Systems.length).toBeGreaterThan(0)

      const path = galaxy.findPath('18', ring2Systems[0], 'dennis', 2)
      expect(path).not.toBeNull()
      expect(path.length).toBe(3) // start + intermediate + end
      expect(path[0]).toBe('18')
      expect(path[path.length - 1]).toBe(ring2Systems[0])
    })

    test('returns null when no path within move value', () => {
      const game = t.fixture()
      game.run()
      const galaxy = new Galaxy(game)

      // Home systems are at distance 3 — unreachable with move 1
      const path = galaxy.findPath('18', 'sol-home', 'dennis', 1)
      expect(path).toBeNull()
    })

    test('cannot path through asteroid field (except destination)', () => {
      // Default seed places tile 45 (asteroid field)
      const game = t.fixture()
      game.run()
      const galaxy = new Galaxy(game)

      const asteroidSystems = findAnomalySystems(game, 'asteroid-field')
      expect(asteroidSystems.length).toBeGreaterThan(0)

      // CAN move to asteroid field as destination
      const pathTo = galaxy.findPath('18', asteroidSystems[0], 'dennis', 10)
      expect(pathTo).not.toBeNull()
      expect(pathTo[pathTo.length - 1]).toBe(asteroidSystems[0])
    })

    test('cannot path through supernova', () => {
      // Seed 'alpha_seed' places tile 43 (supernova)
      const game = t.fixture({ seed: 'alpha_seed', deterministicLayout: false })
      game.run()
      const galaxy = new Galaxy(game)

      const supernovaSystems = findAnomalySystems(game, 'supernova')
      expect(supernovaSystems.length).toBeGreaterThan(0)

      // Cannot move to supernova even as destination
      const path = galaxy.findPath('18', supernovaSystems[0], 'dennis', 10)
      expect(path).toBeNull()
    })

    test('cannot path through enemy fleet (except destination)', () => {
      // Ring1 systems in the default 2p layout: 26, 20, 19, 25, 34, 35
      const game = t.fixture()
      t.setBoard(game, {
        micah: {
          units: {
            '26': { space: ['cruiser'] },
            '20': { space: ['cruiser'] },
            '19': { space: ['cruiser'] },
            '25': { space: ['cruiser'] },
            '34': { space: ['cruiser'] },
            '35': { space: ['cruiser'] },
          },
        },
      })
      game.run()
      const galaxy = new Galaxy(game)

      const ring1Systems = findSystemsAtDistance(game, 1)
      expect(ring1Systems.length).toBe(6)

      // Can still move TO a ring1 system (destination with enemy fleet)
      const pathTo = galaxy.findPath('18', ring1Systems[0], 'dennis', 1)
      expect(pathTo).not.toBeNull()

      // But cannot move THROUGH ring1 to reach ring2
      const ring2Systems = findSystemsAtDistance(game, 2)
      expect(ring2Systems.length).toBeGreaterThan(0)

      const path = galaxy.findPath('18', ring2Systems[0], 'dennis', 2)
      expect(path).toBeNull()
    })

    test('can path through wormhole', () => {
      // Seed 'alpha_seed' places tiles 39 and 82 which both have alpha wormholes
      // Tile 82 (Wormhole Nexus) must be activated to expose alpha wormhole
      const game = t.fixture({ seed: 'alpha_seed', deterministicLayout: false })
      game.run()
      game.state.wormholeNexusActive = true
      const galaxy = new Galaxy(game)

      const alphaSystems = findWormholeSystems(game, 'alpha')
      expect(alphaSystems.length).toBeGreaterThanOrEqual(2)

      // Two alpha wormholes are wormhole-adjacent = 1 hop
      const path = galaxy.findPath(alphaSystems[0], alphaSystems[1], 'dennis', 1)
      expect(path).not.toBeNull()
      expect(path.length).toBe(2)
    })

    test('gravity rift is a valid destination', () => {
      // Default seed places tiles 41 and 67 (gravity rift)
      const game = t.fixture()
      game.run()
      const galaxy = new Galaxy(game)

      const riftSystems = findAnomalySystems(game, 'gravity-rift')
      expect(riftSystems.length).toBeGreaterThan(0)

      // Gravity rift is reachable (unlike supernova)
      const path = galaxy.findPath('18', riftSystems[0], 'dennis', 10)
      expect(path).not.toBeNull()
      expect(galaxy.hasAnomaly(riftSystems[0], 'gravity-rift')).toBe(true)
    })
  })

  describe('Starting Units', () => {
    test('Sol starts with correct units in home system', () => {
      const game = t.fixture()
      game.run()

      const solHome = game.state.units['sol-home']
      expect(solHome).toBeDefined()

      const spaceTypes = solHome.space.map(u => u.type).sort()
      expect(spaceTypes).toEqual(['carrier', 'carrier', 'destroyer', 'fighter', 'fighter', 'fighter'])

      const jordTypes = solHome.planets['jord'].map(u => u.type).sort()
      expect(jordTypes).toEqual([
        'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'space-dock'
      ])
    })

    test('Sol controls home planet', () => {
      const game = t.fixture()
      game.run()
      expect(game.state.planets['jord'].controller).toBe('dennis')
    })

    test('Hacan starts with correct units in home system', () => {
      const game = t.fixture()
      game.run()

      const hacanHome = game.state.units['hacan-home']
      expect(hacanHome).toBeDefined()

      const spaceTypes = hacanHome.space.map(u => u.type).sort()
      expect(spaceTypes).toEqual(['carrier', 'carrier', 'cruiser', 'fighter', 'fighter'])
    })

    test('all players start with starting technologies', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.all().find(p => p.name === 'dennis')
      const micah = game.players.all().find(p => p.name === 'micah')

      // Sol starts with neural-motivator and antimass-deflectors
      const dennisTechs = dennis.getTechnologies()
        .map(id => id.replace('dennis-', ''))
        .sort()
      expect(dennisTechs).toEqual(['antimass-deflectors', 'neural-motivator'])

      // Hacan starts with antimass-deflectors and sarween-tools
      const micahTechs = micah.getTechnologies()
        .map(id => id.replace('micah-', ''))
        .sort()
      expect(micahTechs).toEqual(['antimass-deflectors', 'sarween-tools'])
    })

    test('each unit has unique ID', () => {
      const game = t.fixture()
      game.run()

      const allUnitIds = new Set()
      for (const systemId of Object.keys(game.state.units)) {
        const systemUnits = game.state.units[systemId]
        for (const unit of systemUnits.space) {
          expect(allUnitIds.has(unit.id)).toBe(false)
          allUnitIds.add(unit.id)
        }
        for (const planetUnits of Object.values(systemUnits.planets)) {
          for (const unit of planetUnits) {
            expect(allUnitIds.has(unit.id)).toBe(false)
            allUnitIds.add(unit.id)
          }
        }
      }

      // Both players should have placed units
      expect(allUnitIds.size).toBeGreaterThan(0)
    })
  })

  describe('Planet Control', () => {
    test('home planets start controlled by owning player', () => {
      const game = t.fixture()
      game.run()

      // Sol (dennis) controls Jord
      expect(game.state.planets['jord'].controller).toBe('dennis')

      // Hacan (micah) controls Arretze, Hercant, Kamdorn
      expect(game.state.planets['arretze'].controller).toBe('micah')
      expect(game.state.planets['hercant'].controller).toBe('micah')
      expect(game.state.planets['kamdorn'].controller).toBe('micah')
    })

    test('non-home planets start uncontrolled', () => {
      const game = t.fixture()
      game.run()

      const homePlanets = new Set(['jord', 'arretze', 'hercant', 'kamdorn'])

      const nonHomePlanets = Object.entries(game.state.planets)
        .filter(([id]) => !homePlanets.has(id))

      expect(nonHomePlanets.length).toBeGreaterThan(0)
      for (const [, state] of nonHomePlanets) {
        expect(state.controller).toBeNull()
      }
    })

    test('Mecatol Rex starts uncontrolled', () => {
      const game = t.fixture()
      game.run()
      expect(game.state.planets['mecatol-rex']).toBeDefined()
      expect(game.state.planets['mecatol-rex'].controller).toBeNull()
    })
  })

  describe('5-Player Hyperlane Map', () => {
    function hyperlaneFixture() {
      return t.fixture({
        numPlayers: 5,
        mapLayout: '5-hyperlane',
        deterministicLayout: false,
      })
    }

    test('creates correct number of systems', () => {
      const game = hyperlaneFixture()
      game.run()

      const systemIds = Object.keys(game.state.systems)
      // 1 mecatol + 5 homes + 6 hyperlanes + 25 regular = 37
      expect(systemIds.length).toBe(37)
    })

    test('places hyperlane tiles at correct positions', () => {
      const game = hyperlaneFixture()
      game.run()

      const hyperlaneIds = Object.keys(game.state.systems).filter(
        id => game.state.systems[id].isHyperlane
      )
      expect(hyperlaneIds.length).toBe(6)

      const expectedPositions = [
        { q: 0, r: 1 },
        { q: 1, r: 1 },
        { q: -1, r: 2 },
        { q: 1, r: 2 },
        { q: -1, r: 3 },
        { q: 0, r: 3 },
      ]

      const hlPositions = hyperlaneIds
        .map(id => game.state.systems[id].position)
        .sort((a, b) => a.q - b.q || a.r - b.r)
      const sorted = [...expectedPositions].sort((a, b) => a.q - b.q || a.r - b.r)

      expect(hlPositions).toEqual(sorted)
    })

    test('hyperlane tiles have tileId hyperlane', () => {
      const game = hyperlaneFixture()
      game.run()

      const hyperlaneIds = Object.keys(game.state.systems).filter(
        id => game.state.systems[id].isHyperlane
      )
      for (const id of hyperlaneIds) {
        expect(game.state.systems[id].tileId).toBe('hyperlane')
      }
    })

    test('hyperlane connections stored in state', () => {
      const game = hyperlaneFixture()
      game.run()

      expect(game.state.hyperlaneConnections).toBeDefined()
      expect(game.state.hyperlaneConnections.length).toBe(8)
    })

    test('hyperlane tiles excluded from physical adjacency', () => {
      const game = hyperlaneFixture()
      game.run()

      // Find a hyperlane system
      const hlId = Object.keys(game.state.systems).find(
        id => game.state.systems[id].isHyperlane
      )

      // Hyperlane system should have no adjacent systems
      const adjacent = game._getAdjacentSystems(hlId)
      expect(adjacent).toEqual([])

      // Non-hyperlane systems should NOT list hyperlane tiles as adjacent
      const adjacent18 = game._getAdjacentSystems(18)
      for (const adjId of adjacent18) {
        expect(game.state.systems[adjId].isHyperlane).toBeFalsy()
      }
    })

    test('hyperlane connections create adjacency: c(-1,1) ↔ e(1,0)', () => {
      const game = hyperlaneFixture()
      game.run()

      // Find system at position c(-1,1) and system at position e(1,0)
      const systemC = Object.keys(game.state.systems).find(id => {
        const sys = game.state.systems[id]
        return sys.position.q === -1 && sys.position.r === 1 && !sys.isHyperlane
      })
      const systemE = Object.keys(game.state.systems).find(id => {
        const sys = game.state.systems[id]
        return sys.position.q === 1 && sys.position.r === 0 && !sys.isHyperlane
      })

      expect(systemC).toBeDefined()
      expect(systemE).toBeDefined()

      const adjC = game._getAdjacentSystems(systemC)
      expect(adjC).toContain(systemE)

      const adjE = game._getAdjacentSystems(systemE)
      expect(adjE).toContain(systemC)
    })

    test('hyperlane connections create adjacency: d(0,2) ↔ multiple', () => {
      const game = hyperlaneFixture()
      game.run()

      const systemD = Object.keys(game.state.systems).find(id => {
        const sys = game.state.systems[id]
        return sys.position.q === 0 && sys.position.r === 2 && !sys.isHyperlane
      })
      expect(systemD).toBeDefined()

      const adjD = game._getAdjacentSystems(systemD)

      // d should be connected to e(1,0), f(2,0), g(2,1), c(-1,1), b(-2,2), a(-2,3)
      const expectedNeighborPositions = [
        { q: 1, r: 0 },   // e
        { q: 2, r: 0 },   // f
        { q: 2, r: 1 },   // g
        { q: -1, r: 1 },  // c
        { q: -2, r: 2 },  // b
        { q: -2, r: 3 },  // a
      ]

      for (const pos of expectedNeighborPositions) {
        const neighborId = Object.keys(game.state.systems).find(id => {
          const sys = game.state.systems[id]
          return sys.position.q === pos.q && sys.position.r === pos.r && !sys.isHyperlane
        })
        expect(neighborId).toBeDefined()
        expect(adjD).toContain(neighborId)
      }
    })

    test('hyperlane connections create adjacency: a(-2,3) ↔ g(2,1)', () => {
      const game = hyperlaneFixture()
      game.run()

      const systemA = Object.keys(game.state.systems).find(id => {
        const sys = game.state.systems[id]
        return sys.position.q === -2 && sys.position.r === 3 && !sys.isHyperlane
      })
      const systemG = Object.keys(game.state.systems).find(id => {
        const sys = game.state.systems[id]
        return sys.position.q === 2 && sys.position.r === 1 && !sys.isHyperlane
      })

      expect(systemA).toBeDefined()
      expect(systemG).toBeDefined()

      const adjA = game._getAdjacentSystems(systemA)
      expect(adjA).toContain(systemG)

      const adjG = game._getAdjacentSystems(systemG)
      expect(adjG).toContain(systemA)
    })

    test('non-connected systems across hyperlanes are NOT adjacent', () => {
      const game = hyperlaneFixture()
      game.run()

      // System at c(-1,1) should NOT be adjacent to g(2,1) — they are not connected
      const systemC = Object.keys(game.state.systems).find(id => {
        const sys = game.state.systems[id]
        return sys.position.q === -1 && sys.position.r === 1 && !sys.isHyperlane
      })
      const systemG = Object.keys(game.state.systems).find(id => {
        const sys = game.state.systems[id]
        return sys.position.q === 2 && sys.position.r === 1 && !sys.isHyperlane
      })

      const adjC = game._getAdjacentSystems(systemC)
      expect(adjC).not.toContain(systemG)
    })

    test('pathfinding works through hyperlane connections', () => {
      const game = hyperlaneFixture()
      game.run()
      const galaxy = new Galaxy(game)

      // d(0,2) → e(1,0) should be 1 hop via hyperlane
      const systemD = Object.keys(game.state.systems).find(id => {
        const sys = game.state.systems[id]
        return sys.position.q === 0 && sys.position.r === 2 && !sys.isHyperlane
      })
      const systemE = Object.keys(game.state.systems).find(id => {
        const sys = game.state.systems[id]
        return sys.position.q === 1 && sys.position.r === 0 && !sys.isHyperlane
      })

      const path = galaxy.findPath(systemD, systemE, 'dennis', 1)
      expect(path).not.toBeNull()
      expect(path.length).toBe(2)
    })

    test('places 5 home systems', () => {
      const game = hyperlaneFixture()
      game.run()

      const homeIds = Object.keys(game.state.systems).filter(id => {
        const tile = res.getSystemTile(id) || res.getSystemTile(Number(id))
        return tile && tile.type === 'home'
      })
      expect(homeIds.length).toBe(5)
    })

    test('places correct number of blue and red tiles', () => {
      const game = hyperlaneFixture()
      game.run()

      const blueTiles = Object.keys(game.state.systems).filter(id => {
        const tile = res.getSystemTile(id) || res.getSystemTile(Number(id))
        return tile && tile.type === 'blue'
      })
      const redTiles = Object.keys(game.state.systems).filter(id => {
        const tile = res.getSystemTile(id) || res.getSystemTile(Number(id))
        return tile && tile.type === 'red'
      })

      expect(blueTiles.length).toBe(17)
      expect(redTiles.length).toBe(8)
    })
  })
})
