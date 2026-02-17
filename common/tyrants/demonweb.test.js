Error.stackTraceLimit = 100

const t = require('./testutil.js')
const res = require('./res/index.js')

const { mapConfigs } = res


// Helper: create a demonweb fixture and run up to the rotation request
function demonwebFixture(options = {}) {
  const game = t.fixture({
    map: 'demonweb-2',
    seed: 'demonweb-test',
    ...options,
  })
  game.run()
  return game
}

// Helper: respond to the rotation request with given rotations
function submitRotations(game, rotations = {}) {
  const request = game.waiting
  const selector = request.selectors[0]

  return game.respondToInputRequest({
    actor: selector.actor,
    title: selector.title,
    selection: [{ rotations }],
  })
}

// Helper: submit rotations then choose starting locations for 2 players
function demonwebGameFixture(options = {}) {
  const game = demonwebFixture(options)
  submitRotations(game, options.rotations || {})

  // Choose starting locations — pick the first two available
  // Prefix with '*' to bypass dot-splitting in t.choose (location names contain dots)
  const request1 = game.waiting
  const loc1 = request1.selectors[0].choices[0]
  t.choose(game, '*' + loc1)
  const request2 = game.waiting
  const loc2 = request2.selectors[0].choices[0]
  t.choose(game, '*' + loc2)

  return game
}


describe('Demonweb', () => {

  describe('map initialization', () => {
    test('demonweb-2 map creates correct number of hexes', () => {
      const game = demonwebFixture()
      const map = game.state.assembledMap

      expect(map).toBeDefined()
      expect(map.hexes).toHaveLength(9)
      submitRotations(game)
    })

    test('demonweb-2 map has one A tile, two B tiles, and six C tiles', () => {
      const game = demonwebFixture()
      const hexes = game.state.assembledMap.hexes

      const categories = hexes.map(h => h.tileId[0])
      expect(categories.filter(c => c === 'A')).toHaveLength(1)
      expect(categories.filter(c => c === 'B')).toHaveLength(2)
      expect(categories.filter(c => c === 'C')).toHaveLength(6)
      submitRotations(game)
    })

    test('demonweb map creates map zones with locations', () => {
      const game = demonwebFixture()
      const locations = game.getLocationAll()

      expect(locations.length).toBeGreaterThan(0)

      // Each location should have a hex ID
      for (const loc of locations) {
        expect(loc.hexId).toBeDefined()
      }
      submitRotations(game)
    })

    test('locations have hex position data', () => {
      const game = demonwebFixture()
      const locations = game.getLocationAll()

      for (const loc of locations) {
        expect(loc.hexPosition).toBeDefined()
        expect(typeof loc.hexPosition.x).toBe('number')
        expect(typeof loc.hexPosition.y).toBe('number')
      }

      // Non-edge-tunnel locations should be within 0-1 range
      const nonEdge = locations.filter(l => !l.short.startsWith('edge-'))
      for (const loc of nonEdge) {
        expect(loc.hexPosition.x).toBeGreaterThanOrEqual(0)
        expect(loc.hexPosition.x).toBeLessThanOrEqual(1)
        expect(loc.hexPosition.y).toBeGreaterThanOrEqual(0)
        expect(loc.hexPosition.y).toBeLessThanOrEqual(1)
      }
      submitRotations(game)
    })

    test('demonweb map has starting locations', () => {
      const game = demonwebFixture()
      const startLocs = game.getLocationAll().filter(loc => loc.start)
      expect(startLocs.length).toBeGreaterThan(0)
      submitRotations(game)
    })

    test('neutrals are placed on locations', () => {
      const game = demonwebFixture()
      const locsWithNeutrals = game.getLocationAll().filter(loc => {
        return loc.getTroops().some(t => t.name.startsWith('neutral'))
      })
      expect(locsWithNeutrals.length).toBeGreaterThan(0)
      submitRotations(game)
    })

    test('gemstones are placed at dead ends', () => {
      const game = demonwebFixture()
      const gemstones = game.state.gemstones || {}
      // Gemstones are placed at locations with 0 points and only 1 neighbor
      const deadEnds = game.getLocationAll().filter(
        loc => loc.points === 0 && loc.neighborNames.length === 1
      )
      expect(Object.keys(gemstones).length).toBe(deadEnds.length)
      submitRotations(game)
    })
  })


  describe('rotation setup', () => {
    test('rotation request is sent after initialization', () => {
      const game = demonwebFixture()
      const request = game.waiting

      expect(request).toBeDefined()
      expect(request.selectors[0].title).toBe('Rotate Hex Tiles')
      expect(request.selectors[0].choices).toBe('__UNSPECIFIED__')
    })

    test('rotation request is sent to one of the players', () => {
      const game = demonwebFixture()
      const request = game.waiting
      const actor = request.selectors[0].actor

      const playerNames = game.players.all().map(p => p.name)
      expect(playerNames).toContain(actor)
    })

    test('non-demonweb maps skip rotation setup', () => {
      const game = t.fixture({ map: 'base-2' })
      game.run()

      // Should go straight to choosing starting locations, not rotation
      const request = game.waiting
      expect(request.selectors[0].title).not.toBe('Rotate Hex Tiles')
    })

    test('confirming with no changes preserves the map', () => {
      const game = demonwebFixture()
      const hexesBefore = game.state.assembledMap.hexes.map(h => ({
        tileId: h.tileId,
        rotation: h.rotation,
      }))

      submitRotations(game, {})

      const hexesAfter = game.state.assembledMap.hexes.map(h => ({
        tileId: h.tileId,
        rotation: h.rotation,
      }))
      expect(hexesAfter).toStrictEqual(hexesBefore)
    })

    test('submitting same rotations as defaults preserves the map', () => {
      const game = demonwebFixture()
      const currentRotations = {}
      for (const hex of game.state.assembledMap.hexes) {
        currentRotations[hex.tileId] = hex.rotation
      }

      const locationsBefore = game.getLocationAll().map(l => l.name()).sort()

      submitRotations(game, currentRotations)

      const locationsAfter = game.getLocationAll().map(l => l.name()).sort()
      expect(locationsAfter).toStrictEqual(locationsBefore)
    })

    test('changing rotations rebuilds the map', () => {
      const game = demonwebFixture()
      const hexes = game.state.assembledMap.hexes

      // Pick a tile and change its rotation
      const targetTile = hexes[0]
      const newRotation = (targetTile.rotation + 1) % 6

      submitRotations(game, { [targetTile.tileId]: newRotation })

      const updatedHex = game.state.assembledMap.hexes.find(h => h.tileId === targetTile.tileId)
      expect(updatedHex.rotation).toBe(newRotation)
    })

    test('rotation changes update edge connections', () => {
      const game = demonwebFixture()
      const hexes = game.state.assembledMap.hexes
      const targetTile = hexes[0]
      const connsBefore = targetTile.edgeConnections

      const newRotation = (targetTile.rotation + 1) % 6
      submitRotations(game, { [targetTile.tileId]: newRotation })

      const updatedHex = game.state.assembledMap.hexes.find(h => h.tileId === targetTile.tileId)
      // Edge connections should have changed due to rotation
      expect(updatedHex.edgeConnections).not.toStrictEqual(connsBefore)
    })

    test('rotation changes preserve non-edge-tunnel locations per tile', () => {
      const game = demonwebFixture()
      const tileId = game.state.assembledMap.hexes[0].tileId
      // Edge tunnels change with rotation, but actual tile locations should stay the same
      const countBefore = game.getLocationAll()
        .filter(l => l.hexId === tileId && !l.short.startsWith('edge-')).length

      const currentRotation = game.state.assembledMap.hexes[0].rotation
      submitRotations(game, { [tileId]: (currentRotation + 2) % 6 })

      const countAfter = game.getLocationAll()
        .filter(l => l.hexId === tileId && !l.short.startsWith('edge-')).length
      expect(countAfter).toBe(countBefore)
    })

    test('rotation changes re-place neutrals correctly', () => {
      const game = demonwebFixture()

      // Count total neutrals on the map before
      const neutralsBefore = game.getLocationAll().reduce((sum, loc) => {
        return sum + loc.getTroops().filter(t => t.name.startsWith('neutral')).length
      }, 0)

      // Change a rotation
      const hex = game.state.assembledMap.hexes[0]
      submitRotations(game, { [hex.tileId]: (hex.rotation + 1) % 6 })

      // Count total neutrals after
      const neutralsAfter = game.getLocationAll().reduce((sum, loc) => {
        return sum + loc.getTroops().filter(t => t.name.startsWith('neutral')).length
      }, 0)

      expect(neutralsAfter).toBe(neutralsBefore)
    })

    test('rotation changes re-initialize gemstones', () => {
      const game = demonwebFixture()

      // Change a rotation
      const hex = game.state.assembledMap.hexes[0]
      submitRotations(game, { [hex.tileId]: (hex.rotation + 1) % 6 })

      // Gemstones should match current dead ends
      const deadEnds = game.getLocationAll().filter(
        loc => loc.points === 0 && loc.neighborNames.length === 1
      )
      const gemstones = game.state.gemstones || {}
      expect(Object.keys(gemstones).length).toBe(deadEnds.length)

      for (const loc of deadEnds) {
        expect(gemstones[loc.name()]).toBe(true)
      }
    })

    test('rotation values are normalized to 0-5 range', () => {
      const game = demonwebFixture()
      const hex = game.state.assembledMap.hexes[0]

      // Submit rotation value > 5
      submitRotations(game, { [hex.tileId]: 7 })

      const updatedHex = game.state.assembledMap.hexes.find(h => h.tileId === hex.tileId)
      expect(updatedHex.rotation).toBe(1)  // 7 % 6 = 1
    })

    test('negative rotation values are normalized', () => {
      const game = demonwebFixture()
      const hex = game.state.assembledMap.hexes[0]

      submitRotations(game, { [hex.tileId]: -1 })

      const updatedHex = game.state.assembledMap.hexes.find(h => h.tileId === hex.tileId)
      expect(updatedHex.rotation).toBe(5)  // ((-1 % 6) + 6) % 6 = 5
    })
  })


  describe('turn order', () => {
    test('player after rotator goes first', () => {
      const game = demonwebFixture()
      const request = game.waiting
      const rotator = request.selectors[0].actor

      submitRotations(game, {})

      // The next selector should be choosing starting locations
      // The current player should be the one after the rotator
      const rotatorPlayer = game.players.byName(rotator)
      const expectedFirst = game.players.following(rotatorPlayer)

      // After rotation, chooseInitialLocations iterates players starting from current
      // The current player was set by passToPlayer
      expect(game.players.current().name).toBe(expectedFirst.name)
    })
  })


  describe('game flow', () => {
    test('full game initialization with demonweb map', () => {
      const game = demonwebGameFixture()
      game.run()

      // Should be at the main game loop now (Choose Action)
      const request = game.waiting
      expect(request.selectors[0].title).toBe('Choose Action')
    })

    test('demonweb-3 map works', () => {
      const game = t.fixture({
        map: 'demonweb-3',
        seed: 'demonweb-3-test',
        numPlayers: 3,
      })
      game.run()

      expect(game.state.assembledMap.hexes).toHaveLength(9)
      expect(game.waiting.selectors[0].title).toBe('Rotate Hex Tiles')
    })

    test('replay produces consistent state', () => {
      const game = demonwebFixture()
      const hexesBefore = game.state.assembledMap.hexes.map(h => h.tileId)
      const hex = game.state.assembledMap.hexes[0]
      const newRotation = (hex.rotation + 1) % 6

      submitRotations(game, { [hex.tileId]: newRotation })

      // Choose starting locations (prefix with '*' to bypass dot-splitting)
      const r1 = game.waiting
      t.choose(game, '*' + r1.selectors[0].choices[0])
      const r2 = game.waiting
      t.choose(game, '*' + r2.selectors[0].choices[0])

      // Re-run the game (replay)
      game.run()

      // State should be consistent after replay
      const hexesAfter = game.state.assembledMap.hexes.map(h => h.tileId)
      expect(hexesAfter).toStrictEqual(hexesBefore)

      const updatedHex = game.state.assembledMap.hexes.find(h => h.tileId === hex.tileId)
      expect(updatedHex.rotation).toBe(newRotation)
    })
  })


  describe('map structure', () => {
    test('locations have valid neighbors', () => {
      const game = demonwebFixture()
      const allLocNames = new Set(game.getLocationAll().map(l => l.name()))

      for (const loc of game.getLocationAll()) {
        for (const neighborName of loc.neighborNames) {
          expect(allLocNames).toContain(neighborName)
        }
      }
      submitRotations(game)
    })

    test('neighbor relationships are bidirectional', () => {
      const game = demonwebFixture()

      for (const loc of game.getLocationAll()) {
        for (const neighborName of loc.neighborNames) {
          const neighbor = game.getLocationByName(neighborName)
          expect(neighbor.neighborNames).toContain(loc.name())
        }
      }
      submitRotations(game)
    })

    test('assembled map hexes have positions from config', () => {
      const game = demonwebFixture()
      const config = mapConfigs.mapConfigs['demonweb-2']
      const hexes = game.state.assembledMap.hexes

      for (let i = 0; i < hexes.length; i++) {
        expect(hexes[i].position).toStrictEqual(config.layout[i].position)
      }
      submitRotations(game)
    })

    test('cross-hex connections exist between adjacent tiles', () => {
      const game = demonwebFixture()
      const locations = game.getLocationAll()

      // Find locations that have neighbors on different hexes
      const crossHexConnections = []
      for (const loc of locations) {
        for (const neighborName of loc.neighborNames) {
          const neighborHexId = neighborName.split('.')[0]
          if (neighborHexId !== loc.hexId) {
            crossHexConnections.push({
              from: loc.name(),
              to: neighborName,
            })
          }
        }
      }

      // A 9-hex map should have some cross-hex connections
      expect(crossHexConnections.length).toBeGreaterThan(0)
      submitRotations(game)
    })
  })
})
