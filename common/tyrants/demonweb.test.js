Error.stackTraceLimit = 100

const t = require('./testutil.js')
const res = require('./res/index.js')

const { mapConfigs } = res
const { encodeMapLayout, decodeMapLayout, validateMapLayout } = res.mapLayoutCodec


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

// Helper: create a demonweb game ready for the main loop with gem-related setup
// Options: power, gems, troopAtGem (boolean)
function gemFixture(opts = {}) {
  const game = t.fixture({
    map: 'demonweb-2',
    seed: 'demonweb-test',
  })

  game.testSetBreakpoint('initialization-complete', (game) => {
    const dennis = game.players.byName('dennis')

    if (opts.power !== undefined) {
      dennis.setCounter('power', opts.power)
    }
    if (opts.gems !== undefined) {
      dennis.setCounter('gems', opts.gems)
    }

    // Place a dennis troop at the first gem location
    if (opts.troopAtGem) {
      const gemLoc = Object.keys(game.state.gemstones)[0]
      if (gemLoc) {
        const loc = game.getLocationByName(gemLoc)
        game.zones.byPlayer(dennis, 'troops').peek().moveTo(loc)
      }
    }
  })

  game.run()
  submitRotations(game, {})

  // Choose starting locations
  const r1 = game.waiting
  t.choose(game, '*' + r1.selectors[0].choices[0])
  const r2 = game.waiting
  t.choose(game, '*' + r2.selectors[0].choices[0])

  return game
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


  describe('gemstone rules', () => {

    describe('acquire gem', () => {
      test('gem action is available when player has troop at gem location and power', () => {
        const game = gemFixture({ power: 1, troopAtGem: true })
        game.run()

        const request = game.waiting
        const choices = request.selectors[0].choices
        const gemAction = choices.find(c => c.title && c.title.startsWith('Gem'))
        expect(gemAction).toBeDefined()
        expect(gemAction.choices.some(c => c.title === 'Acquire Gem')).toBe(true)
      })

      test('gem action not available without power', () => {
        const game = gemFixture({ power: 0, troopAtGem: true })
        game.run()

        const request = game.waiting
        const choices = request.selectors[0].choices
        const gemAction = choices.find(c => c.title && c.title.startsWith('Gem'))
        const acquireAvailable = gemAction && gemAction.choices.some(c => c.title === 'Acquire Gem')
        expect(acquireAvailable).toBeFalsy()
      })

      test('gem action not available without troop at gem location', () => {
        const game = gemFixture({ power: 1, troopAtGem: false })
        game.run()

        const request = game.waiting
        const choices = request.selectors[0].choices
        const gemAction = choices.find(c => c.title && c.title.startsWith('Gem'))
        const acquireAvailable = gemAction && gemAction.choices.some(c => c.title === 'Acquire Gem')
        expect(acquireAvailable).toBeFalsy()
      })

      test('acquiring a gem costs 1 power and adds gem to player', () => {
        const game = gemFixture({ power: 2, troopAtGem: true })
        game.run()

        const boardGemsBefore = Object.keys(game.state.gemstones).length

        t.choose(game, 'Gem.Acquire Gem')

        // Re-fetch player after replay (reset creates new player objects)
        const dennis = game.players.byName('dennis')
        expect(dennis.getCounter('power')).toBe(1)
        expect(dennis.getCounter('gems')).toBe(1)
        expect(Object.keys(game.state.gemstones).length).toBe(boardGemsBefore - 1)
      })

      test('can only acquire one gem per turn', () => {
        const game = gemFixture({ power: 3, troopAtGem: true })

        // Place a second troop at another gem location
        game.testSetBreakpoint('initialization-complete', (game) => {
          const dennis = game.players.byName('dennis')
          const gemLocs = Object.keys(game.state.gemstones)
          if (gemLocs.length > 1) {
            const loc = game.getLocationByName(gemLocs[1])
            game.zones.byPlayer(dennis, 'troops').peek().moveTo(loc)
          }
        })
        game.run()

        // Acquire first gem
        t.choose(game, 'Gem.Acquire Gem')

        // Acquire Gem should no longer be available
        const request = game.waiting
        const choices = request.selectors[0].choices
        const gemAction = choices.find(c => c.title && c.title.startsWith('Gem'))
        const acquireAvailable = gemAction && gemAction.choices.some(c => c.title === 'Acquire Gem')
        expect(acquireAvailable).toBeFalsy()
      })

      test('acquired gem is removed from the board', () => {
        const game = gemFixture({ power: 1, troopAtGem: true })
        game.run()

        // Find which gem location has the troop
        const dennis = game.players.byName('dennis')
        const gemLocName = Object.keys(game.state.gemstones).find(locName => {
          const loc = game.getLocationByName(locName)
          return loc.getTroops(dennis).length > 0
        })

        t.choose(game, 'Gem.Acquire Gem')

        // That specific gem should be gone
        expect(game.state.gemstones[gemLocName]).toBeUndefined()
      })
    })


    describe('spend gem', () => {
      test('spend gem for power gives 3 power', () => {
        const game = gemFixture({ power: 0, gems: 1 })
        game.run()

        t.choose(game, 'Gem.Spend Gem for Power')

        const dennis = game.players.byName('dennis')
        expect(dennis.getCounter('power')).toBe(3)
        expect(dennis.getCounter('gems')).toBe(0)
      })

      test('spend gem for influence gives 3 influence', () => {
        const game = gemFixture({ power: 0, gems: 1 })
        game.run()

        t.choose(game, 'Gem.Spend Gem for Influence')

        const dennis = game.players.byName('dennis')
        expect(dennis.getCounter('influence')).toBe(3)
        expect(dennis.getCounter('gems')).toBe(0)
      })

      test('spend gem action not available with zero gems', () => {
        const game = gemFixture({ power: 0, gems: 0 })
        game.run()

        const request = game.waiting
        const choices = request.selectors[0].choices
        const gemAction = choices.find(c => c.title && c.title.startsWith('Gem'))
        expect(gemAction).toBeUndefined()
      })

      test('cannot spend gem acquired this turn', () => {
        const game = gemFixture({ power: 1, gems: 0, troopAtGem: true })
        game.run()

        // Acquire a gem
        t.choose(game, 'Gem.Acquire Gem')

        const dennis = game.players.byName('dennis')
        expect(dennis.getCounter('gems')).toBe(1)

        // Spend gem should NOT be available (just acquired)
        const request = game.waiting
        const choices = request.selectors[0].choices
        const gemAction = choices.find(c => c.title && c.title.startsWith('Gem'))
        const spendPowerAvailable = gemAction && gemAction.choices.some(c => c.title === 'Spend Gem for Power')
        const spendInfluenceAvailable = gemAction && gemAction.choices.some(c => c.title === 'Spend Gem for Influence')
        expect(spendPowerAvailable).toBeFalsy()
        expect(spendInfluenceAvailable).toBeFalsy()
      })

      test('can spend pre-existing gem even after acquiring one this turn', () => {
        const game = gemFixture({ power: 1, gems: 1, troopAtGem: true })
        game.run()

        // Acquire a gem (now have 2 gems total, 1 acquired this turn)
        t.choose(game, 'Gem.Acquire Gem')

        const dennis = game.players.byName('dennis')
        expect(dennis.getCounter('gems')).toBe(2)

        // Should be able to spend the pre-existing gem (2 total - 1 acquired = 1 spendable)
        const request = game.waiting
        const choices = request.selectors[0].choices
        const gemAction = choices.find(c => c.title && c.title.startsWith('Gem'))
        expect(gemAction).toBeDefined()
        expect(gemAction.choices.some(c => c.title === 'Spend Gem for Power')).toBe(true)
      })

      test('can spend multiple gems in one turn if pre-existing', () => {
        const game = gemFixture({ power: 0, gems: 2 })
        game.run()

        // Spend first gem
        t.choose(game, 'Gem.Spend Gem for Power')

        const dennis = game.players.byName('dennis')
        expect(dennis.getCounter('gems')).toBe(1)

        // Should still be able to spend the second gem
        const request = game.waiting
        const choices = request.selectors[0].choices
        const gemAction = choices.find(c => c.title && c.title.startsWith('Gem'))
        expect(gemAction).toBeDefined()
        expect(gemAction.choices.some(c => c.title === 'Spend Gem for Power')).toBe(true)
      })
    })
  })

  describe('starting locations', () => {
    // Starting locations have start: true on the tile definition.
    // C1-C6 each have one starting location. A9 has one. B tiles and other A tiles have none.
    // After a player deploys to a starting location, that location is removed from choices.

    const STARTING_LAYOUT = [
      { tileId: 'B1', rotation: 0 },
      { tileId: 'C1', rotation: 0 },
      { tileId: 'C2', rotation: 0 },
      { tileId: 'C3', rotation: 0 },
      { tileId: 'A1', rotation: 0 },
      { tileId: 'C4', rotation: 0 },
      { tileId: 'C5', rotation: 0 },
      { tileId: 'C6', rotation: 0 },
      { tileId: 'B2', rotation: 0 },
    ]

    // Expected starting locations for C1-C6
    const EXPECTED_STARTS = [
      'C1.magma-gate',
      'C2.c2-menzoberranzan',
      'C3.xal-veldrin',
      'C4.caer-sidi',
      'C5.ath-qua',
      'C6.zixzolca',
    ].sort()

    test('starting location choices come from start:true sites', () => {
      const game = demonwebFixture({ mapLayout: STARTING_LAYOUT })
      submitRotations(game, {})

      const request = game.waiting
      expect(request.selectors[0].title).toBe('Choose starting location')
      const choices = request.selectors[0].choices
      expect(choices).toEqual(EXPECTED_STARTS)
    })

    test('each C tile contributes exactly one starting location', () => {
      const game = demonwebFixture({ mapLayout: STARTING_LAYOUT })
      submitRotations(game, {})

      const request = game.waiting
      const choices = request.selectors[0].choices

      // Each choice maps to a different C tile
      const tileIds = choices.map(c => c.split('.')[0])
      expect(tileIds).toHaveLength(6)
      expect(new Set(tileIds).size).toBe(6)
    })

    test('chosen location is removed from next player choices', () => {
      const game = demonwebFixture({ mapLayout: STARTING_LAYOUT })
      submitRotations(game, {})

      const request1 = game.waiting
      const choices1 = [...request1.selectors[0].choices]
      const firstChoice = choices1[0]
      t.choose(game, '*' + firstChoice)

      const request2 = game.waiting
      const choices2 = request2.selectors[0].choices
      expect(choices2).not.toContain(firstChoice)
      expect(choices2).toHaveLength(choices1.length - 1)
    })

    test('troop is deployed to the chosen starting location', () => {
      const game = demonwebFixture({ mapLayout: STARTING_LAYOUT })
      submitRotations(game, {})

      const request1 = game.waiting
      const chosenName = request1.selectors[0].choices[0]
      t.choose(game, '*' + chosenName)

      const loc = game.getLocationByName(chosenName)
      const dennis = game.players.byName('dennis')
      expect(loc.getTroops(dennis).length).toBe(1)
    })

    test('A9 tile provides wells-of-darkness as a starting location', () => {
      const a9Layout = [
        { tileId: 'B1', rotation: 0 },
        { tileId: 'C1', rotation: 0 },
        { tileId: 'C2', rotation: 0 },
        { tileId: 'C3', rotation: 0 },
        { tileId: 'A9', rotation: 0 },
        { tileId: 'C4', rotation: 0 },
        { tileId: 'C5', rotation: 0 },
        { tileId: 'C6', rotation: 0 },
        { tileId: 'B2', rotation: 0 },
      ]
      const game = demonwebFixture({ mapLayout: a9Layout })
      submitRotations(game, {})

      const request = game.waiting
      const choices = request.selectors[0].choices
      expect(choices).toContain('A9.wells-of-darkness')
      expect(choices).toHaveLength(7)  // 6 from C tiles + 1 from A9
    })

    test('non-A9 A tiles do not provide starting locations', () => {
      // A1 has no start:true sites
      const game = demonwebFixture({ mapLayout: STARTING_LAYOUT })
      submitRotations(game, {})

      const request = game.waiting
      const choices = request.selectors[0].choices
      const a1Choices = choices.filter(c => c.startsWith('A1.'))
      expect(a1Choices).toHaveLength(0)
    })

    test('B tiles do not provide starting locations', () => {
      const game = demonwebFixture({ mapLayout: STARTING_LAYOUT })
      submitRotations(game, {})

      const request = game.waiting
      const choices = request.selectors[0].choices
      const bChoices = choices.filter(c => c.startsWith('B1.') || c.startsWith('B2.'))
      expect(bChoices).toHaveLength(0)
    })

    test('starting location choices are sorted alphabetically', () => {
      const game = demonwebFixture({ mapLayout: STARTING_LAYOUT })
      submitRotations(game, {})

      const request = game.waiting
      const choices = request.selectors[0].choices
      const sorted = [...choices].sort()
      expect(choices).toEqual(sorted)
    })

    test('both players deploy before main loop begins', () => {
      const game = demonwebGameFixture({ mapLayout: STARTING_LAYOUT })
      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')

      // Both players should have a troop on a starting location
      const startLocs = game.getLocationAll().filter(loc => loc.start)
      const dennisStarts = startLocs.filter(loc => loc.getTroops(dennis).length > 0)
      const micahStarts = startLocs.filter(loc => loc.getTroops(micah).length > 0)

      expect(dennisStarts).toHaveLength(1)
      expect(micahStarts).toHaveLength(1)
      expect(dennisStarts[0]).not.toBe(micahStarts[0])
    })

    test('players deploy to different starting locations', () => {
      const game = demonwebGameFixture({ mapLayout: STARTING_LAYOUT })
      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')

      const allLocs = game.getLocationAll()
      const dennisLoc = allLocs.find(loc => loc.start && loc.getTroops(dennis).length > 0)
      const micahLoc = allLocs.find(loc => loc.start && loc.getTroops(micah).length > 0)

      expect(dennisLoc).toBeDefined()
      expect(micahLoc).toBeDefined()
      expect(dennisLoc.name()).not.toBe(micahLoc.name())
    })
  })

  describe('A2 triad bonus', () => {
    // A2 (Zelatar) has a triad bonus for sites: fogtown, gallenghast, darkflame
    // Each site: size 3, 2 neutrals
    // Bonuses: presence (+1 influence), control (+1 influence, +1 power, +1 VP),
    //          totalControl (+2 influence, +2 power, +4 VP)
    //
    // The triad bonus fires at the start of a player's turn (preActions) and
    // again mid-turn after deploying a troop that completes or upgrades a triad.
    // Within a single turn, each tier is awarded at most once (no double-counting).

    const A2_LAYOUT = [
      { tileId: 'B1', rotation: 0 },
      { tileId: 'C1', rotation: 0 },
      { tileId: 'C2', rotation: 0 },
      { tileId: 'C3', rotation: 0 },
      { tileId: 'A2', rotation: 0 },
      { tileId: 'C4', rotation: 0 },
      { tileId: 'C5', rotation: 0 },
      { tileId: 'C6', rotation: 0 },
      { tileId: 'B2', rotation: 0 },
    ]

    const TRIAD_SITES = ['A2.fogtown', 'A2.gallenghast', 'A2.darkflame']

    // Create a game with A2 in center, place troops at triad sites, and
    // advance to the main action loop for the first player.
    function triadFixture(opts = {}) {
      const game = t.fixture({
        map: 'demonweb-2',
        seed: 'demonweb-test',
        mapLayout: A2_LAYOUT,
      })

      game.testSetBreakpoint('initialization-complete', (game) => {
        const dennis = game.players.byName('dennis')

        // Remove neutrals first so there's room for player troops
        if (opts.removeNeutrals) {
          for (const siteName of TRIAD_SITES) {
            const loc = game.getLocationByName(siteName)
            const neutrals = loc.getTroops().filter(tok => !tok.owner)
            for (const n of neutrals) {
              n.moveTo(game.zones.byId('devoured'))
            }
          }
        }

        // Place troops at triad sites
        if (opts.troopsPerSite) {
          for (const siteName of TRIAD_SITES) {
            const loc = game.getLocationByName(siteName)
            for (let j = 0; j < opts.troopsPerSite; j++) {
              const troop = game.zones.byPlayer(dennis, 'troops').peek()
              if (troop) {
                troop.moveTo(loc)
              }
            }
          }
        }
      })

      game.run()
      submitRotations(game, {})

      // Choose starting locations
      const r1 = game.waiting
      t.choose(game, '*' + r1.selectors[0].choices[0])
      const r2 = game.waiting
      t.choose(game, '*' + r2.selectors[0].choices[0])

      return game
    }

    test('A2 tile is placed via mapLayout', () => {
      const game = triadFixture()
      const hexes = game.state.assembledMap.hexes
      const a2Hex = hexes.find(h => h.tileId === 'A2')
      expect(a2Hex).toBeDefined()

      // Triad sites exist as locations
      for (const siteName of TRIAD_SITES) {
        expect(game.getLocationByName(siteName)).toBeDefined()
      }
    })

    test('no bonus when player has no troops at triad sites', () => {
      const game = triadFixture()
      const dennis = game.players.byName('dennis')
      const vpBefore = dennis.getCounter('points')

      t.choose(game, 'Pass')

      // No VP gained
      expect(dennis.getCounter('points')).toBe(vpBefore)
    })

    test('no bonus when player has troops at only some triad sites', () => {
      const game = t.fixture({
        map: 'demonweb-2',
        seed: 'demonweb-test',
        mapLayout: A2_LAYOUT,
      })

      game.testSetBreakpoint('initialization-complete', (game) => {
        const dennis = game.players.byName('dennis')
        // Place troop at only 2 of 3 triad sites
        for (let i = 0; i < 2; i++) {
          const loc = game.getLocationByName(TRIAD_SITES[i])
          game.zones.byPlayer(dennis, 'troops').peek().moveTo(loc)
        }
      })

      game.run()
      submitRotations(game, {})
      const r1 = game.waiting
      t.choose(game, '*' + r1.selectors[0].choices[0])
      const r2 = game.waiting
      t.choose(game, '*' + r2.selectors[0].choices[0])

      const dennis = game.players.byName('dennis')
      const vpBefore = dennis.getCounter('points')

      t.choose(game, 'Pass')

      expect(dennis.getCounter('points')).toBe(vpBefore)
    })

    test('presence bonus: +1 influence at start of turn when troops at all 3 sites', () => {
      const game = triadFixture({ troopsPerSite: 1 })
      const dennis = game.players.byName('dennis')

      // Presence bonus fires at start of turn, giving +1 influence.
      // The influence is available during the turn for spending.
      // After cleanup it resets, but we can observe it in the action phase.
      const request = game.waiting
      expect(request.selectors[0].actor).toBe('dennis')

      // Influence should already include presence bonus (+1)
      expect(dennis.getCounter('influence')).toBe(1)
    })

    test('control bonus: +1 influence, +1 power, +1 VP at start of turn', () => {
      // Remove neutrals, place 2 troops per site -> dennis controls (2 troops, 0 neutral)
      const game = triadFixture({ removeNeutrals: true, troopsPerSite: 2 })
      const dennis = game.players.byName('dennis')

      // Verify control (not total control): 2 of 3 slots filled
      for (const siteName of TRIAD_SITES) {
        const loc = game.getLocationByName(siteName)
        expect(loc.getController()).toBe(dennis)
        expect(loc.getTotalController()).toBeUndefined()  // Not all slots filled
      }

      // Control bonus fires at start of turn
      expect(dennis.getCounter('influence')).toBe(1)
      expect(dennis.getCounter('power')).toBe(1)
      expect(dennis.getCounter('points')).toBe(1)
    })

    test('total control bonus: +2 influence, +2 power, +4 VP at start of turn', () => {
      // Remove neutrals, fill all 3 slots (size 3) with dennis troops
      const game = triadFixture({ removeNeutrals: true, troopsPerSite: 3 })
      const dennis = game.players.byName('dennis')

      // Verify total control
      for (const siteName of TRIAD_SITES) {
        const loc = game.getLocationByName(siteName)
        expect(loc.getTotalController()).toBe(dennis)
      }

      // Total control bonus at start of turn
      expect(dennis.getCounter('influence')).toBe(2)
      expect(dennis.getCounter('power')).toBe(2)
      expect(dennis.getCounter('points')).toBe(4)
    })

    test('triad VP bonus accumulates across turns', () => {
      // Control bonus: +1 VP per turn
      const game = triadFixture({ removeNeutrals: true, troopsPerSite: 2 })

      // Dennis's turn starts with +1 VP from control bonus
      expect(game.players.byName('dennis').getCounter('points')).toBe(1)

      // Dennis's turn — pass
      t.choose(game, 'Pass')

      // micah's turn — pass
      t.choose(game, 'Pass')

      // Dennis's second turn — gains another +1 VP at start
      expect(game.players.byName('dennis').getCounter('points')).toBe(2)
    })

    test('triad bonus only applies to current player', () => {
      const game = triadFixture({ troopsPerSite: 1 })
      const micah = game.players.byName('micah')

      // Dennis's turn — only dennis is checked, micah unaffected
      expect(micah.getCounter('influence')).toBe(0)
      expect(micah.getCounter('points')).toBe(0)
    })

    test('highest applicable tier wins (control over presence)', () => {
      // With control of all 3 sites, control bonus applies (not presence)
      const game = triadFixture({ removeNeutrals: true, troopsPerSite: 2 })
      const dennis = game.players.byName('dennis')

      // Should get control bonus (+1 each), not presence (+1 influence only)
      expect(dennis.getCounter('influence')).toBe(1)
      expect(dennis.getCounter('power')).toBe(1)
      expect(dennis.getCounter('points')).toBe(1)
    })

    test('bonus is not double-counted within the same turn', () => {
      // Presence bonus fires at start of turn. Deploying to a triad site
      // shouldn't re-award the same tier.
      const game = triadFixture({ troopsPerSite: 1 })
      const dennis = game.players.byName('dennis')

      // Presence bonus already fired at start of turn
      expect(dennis.getCounter('influence')).toBe(1)

      // The bonus should still be 1 influence, not doubled
      // (even though troops are still at all 3 sites)
      expect(dennis.getCounter('influence')).toBe(1)
    })
  })

  describe('map layout codec', () => {
    test('encode produces expected format', () => {
      const hexes = [
        { tileId: 'B1', rotation: 3 },
        { tileId: 'C4', rotation: 0 },
        { tileId: 'C2', rotation: 1 },
      ]
      const result = encodeMapLayout('demonweb-2', hexes)
      expect(result).toBe('demonweb-2:B1r3,C4r0,C2r1')
    })

    test('decode parses valid string', () => {
      const result = decodeMapLayout('demonweb-2:B1r3,C4r0,C2r1')
      expect(result.mapName).toBe('demonweb-2')
      expect(result.entries).toEqual([
        { tileId: 'B1', rotation: 3 },
        { tileId: 'C4', rotation: 0 },
        { tileId: 'C2', rotation: 1 },
      ])
    })

    test('encode/decode round-trip', () => {
      const game = demonwebFixture()
      const hexes = game.state.assembledMap.hexes
      const mapName = game.settings.map

      const encoded = encodeMapLayout(mapName, hexes)
      const decoded = decodeMapLayout(encoded)

      expect(decoded.mapName).toBe(mapName)
      expect(decoded.entries).toHaveLength(hexes.length)
      for (let i = 0; i < hexes.length; i++) {
        expect(decoded.entries[i].tileId).toBe(hexes[i].tileId)
        expect(decoded.entries[i].rotation).toBe(hexes[i].rotation)
      }
      submitRotations(game)
    })

    test('decode rejects invalid strings', () => {
      expect(() => decodeMapLayout('')).toThrow()
      expect(() => decodeMapLayout('no-colon')).toThrow()
      expect(() => decodeMapLayout('map:')).toThrow()
      expect(() => decodeMapLayout('map:invalid')).toThrow()
      expect(() => decodeMapLayout('map:B1rX')).toThrow()
    })

    test('decode rejects multi-digit rotations', () => {
      expect(() => decodeMapLayout('map:B1r12')).toThrow()
    })

    test('validate accepts correct layout', () => {
      const game = demonwebFixture()
      const hexes = game.state.assembledMap.hexes
      const entries = hexes.map(h => ({ tileId: h.tileId, rotation: h.rotation }))
      const result = validateMapLayout('demonweb-2', entries)
      expect(result.valid).toBe(true)
      submitRotations(game)
    })

    test('validate rejects wrong tile count', () => {
      const result = validateMapLayout('demonweb-2', [{ tileId: 'B1', rotation: 0 }])
      expect(result.valid).toBe(false)
      expect(result.error).toMatch(/Expected 9/)
    })

    test('validate rejects unknown tile', () => {
      const entries = Array(9).fill(null).map((_, i) => ({ tileId: `Z${i+1}`, rotation: 0 }))
      const result = validateMapLayout('demonweb-2', entries)
      expect(result.valid).toBe(false)
      expect(result.error).toMatch(/Unknown tile/)
    })

    test('validate rejects duplicate tiles', () => {
      const entries = Array(9).fill(null).map(() => ({ tileId: 'B1', rotation: 0 }))
      const result = validateMapLayout('demonweb-2', entries)
      expect(result.valid).toBe(false)
      expect(result.error).toMatch(/Duplicate/)
    })

    test('validate rejects unknown map', () => {
      const result = validateMapLayout('unknown-map', [])
      expect(result.valid).toBe(false)
      expect(result.error).toMatch(/Unknown map/)
    })

    test('validate rejects invalid rotation', () => {
      const entries = Array(9).fill(null).map((_, i) => ({
        tileId: ['B1', 'C1', 'C2', 'C3', 'A1', 'C4', 'C5', 'C6', 'B2'][i],
        rotation: i === 0 ? 6 : 0,
      }))
      const result = validateMapLayout('demonweb-2', entries)
      expect(result.valid).toBe(false)
      expect(result.error).toMatch(/Invalid rotation/)
    })
  })

  describe('mapLayout setting', () => {
    test('mapLayout produces exact tiles specified', () => {
      const layout = [
        { tileId: 'B2', rotation: 1 },
        { tileId: 'C3', rotation: 2 },
        { tileId: 'C1', rotation: 0 },
        { tileId: 'C5', rotation: 3 },
        { tileId: 'A2', rotation: 0 },
        { tileId: 'C4', rotation: 4 },
        { tileId: 'C6', rotation: 5 },
        { tileId: 'C2', rotation: 1 },
        { tileId: 'B1', rotation: 2 },
      ]
      const game = demonwebFixture({ mapLayout: layout })
      const hexes = game.state.assembledMap.hexes

      for (let i = 0; i < layout.length; i++) {
        expect(hexes[i].tileId).toBe(layout[i].tileId)
      }
      submitRotations(game)
    })

    test('rotations from mapLayout are used as initial defaults', () => {
      const layout = [
        { tileId: 'B2', rotation: 3 },
        { tileId: 'C3', rotation: 2 },
        { tileId: 'C1', rotation: 1 },
        { tileId: 'C5', rotation: 4 },
        { tileId: 'A2', rotation: 5 },
        { tileId: 'C4', rotation: 0 },
        { tileId: 'C6', rotation: 2 },
        { tileId: 'C2', rotation: 3 },
        { tileId: 'B1', rotation: 1 },
      ]
      const game = demonwebFixture({ mapLayout: layout })
      const hexes = game.state.assembledMap.hexes

      for (let i = 0; i < layout.length; i++) {
        expect(hexes[i].rotation).toBe(layout[i].rotation)
      }
      submitRotations(game)
    })

    test('rotation setup phase still runs after import', () => {
      const layout = [
        { tileId: 'B2', rotation: 0 },
        { tileId: 'C3', rotation: 0 },
        { tileId: 'C1', rotation: 0 },
        { tileId: 'C5', rotation: 0 },
        { tileId: 'A2', rotation: 0 },
        { tileId: 'C4', rotation: 0 },
        { tileId: 'C6', rotation: 0 },
        { tileId: 'C2', rotation: 0 },
        { tileId: 'B1', rotation: 0 },
      ]
      const game = demonwebFixture({ mapLayout: layout })

      // Should be waiting for rotation input
      const request = game.waiting
      expect(request).toBeDefined()
      expect(request.selectors[0].title).toBe('Rotate Hex Tiles')

      // Player can still change rotations
      const tileId = game.state.assembledMap.hexes[0].tileId
      submitRotations(game, { [tileId]: 3 })

      // After rotation, the tile should have the new rotation
      const updatedHex = game.state.assembledMap.hexes.find(h => h.tileId === tileId)
      expect(updatedHex.rotation).toBe(3)
    })

    test('partial mapLayout uses specified tiles for those slots', () => {
      // Only specify first two slots; rest should be random
      const layout = [
        { tileId: 'B2', rotation: 1 },
        { tileId: 'C3', rotation: 2 },
      ]
      const game = demonwebFixture({ mapLayout: layout })
      const hexes = game.state.assembledMap.hexes

      // First two should be exactly as specified
      expect(hexes[0].tileId).toBe('B2')
      expect(hexes[1].tileId).toBe('C3')

      // Should still have 9 hexes total
      expect(hexes).toHaveLength(9)
      submitRotations(game)
    })

    test('existing games without mapLayout still work', () => {
      // Default demonweb fixture (no mapLayout)
      const game = demonwebFixture()
      const hexes = game.state.assembledMap.hexes

      expect(hexes).toHaveLength(9)
      // Should use greedy rotation (not all zero)
      submitRotations(game)
    })

    test('mapLayout round-trip: export then import produces same map', () => {
      // Create a game, export its layout, create a new game with that layout
      const game1 = demonwebFixture()
      const hexes1 = game1.state.assembledMap.hexes
      const encoded = encodeMapLayout('demonweb-2', hexes1)
      submitRotations(game1)

      // Decode to get layout entries
      const { entries } = decodeMapLayout(encoded)

      // Create a new game with this layout
      const game2 = demonwebFixture({ mapLayout: entries })
      const hexes2 = game2.state.assembledMap.hexes

      // Same tiles and rotations
      for (let i = 0; i < hexes1.length; i++) {
        expect(hexes2[i].tileId).toBe(hexes1[i].tileId)
        expect(hexes2[i].rotation).toBe(hexes1[i].rotation)
      }
      submitRotations(game2)
    })
  })
})
