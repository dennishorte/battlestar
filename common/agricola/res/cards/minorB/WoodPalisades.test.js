const t = require('../../../testutil_v2.js')

describe('Wood Palisades', () => {
  test('edge fences become palisades — bonus points via getEndGamePoints', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['wood-palisades-b030'],
        wood: 15,
      },
      actionSpaces: ['Fencing'],
    })
    game.run()

    // Dennis takes Fencing
    t.choose(game, 'Fencing')

    // Build pasture at (0,2) — a corner space with 2 board edges (top, right)
    // Edges: top (board edge), right (board edge = col 4? no, col 2 isn't edge)
    // Actually farmyard is 3 rows x 5 cols. Space (0,2) needs fences on:
    // top (board edge), left (neighbor), right (neighbor), bottom (neighbor)
    // Only top is a board edge → 1 palisade, 3 internal fences
    t.action(game, 'build-pasture', { spaces: [{ row: 0, col: 2 }] })
    t.choose(game, 'Done building fences')

    // Remaining turns
    t.choose(game, 'Grain Seeds')     // micah
    t.choose(game, 'Day Laborer')     // dennis
    t.choose(game, 'Clay Pit')        // micah

    const dennis = game.players.byName('dennis')

    // 1 palisade (top edge of (0,2))
    expect(dennis.farmyard.palisades.length).toBe(1)
    // 3 internal fences
    expect(dennis.farmyard.fences.length).toBe(3)

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['wood-palisades-b030'],
        wood: 10, // 15 - 3 (internal) - 2 (palisade)
        food: 2, // Day Laborer
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 2 }] }],
        },
      },
    })

    // getEndGamePoints: 1 palisade = 1 VP
    const card = game.cards.byId('wood-palisades-b030')
    expect(card.definition.getEndGamePoints(dennis)).toBe(1)
  })

  test('palisades count as fences for enclosure', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['wood-palisades-b030'],
        wood: 15,
      },
      actionSpaces: ['Fencing'],
    })
    game.run()

    t.choose(game, 'Fencing')
    // Build pasture at top-right corner (0,4) — 2 board edges (top, right)
    // Needs: top (palisade), right (palisade), left (internal), bottom (internal)
    t.action(game, 'build-pasture', { spaces: [{ row: 0, col: 4 }] })
    t.choose(game, 'Done building fences')

    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Clay Pit')

    const dennis = game.players.byName('dennis')

    // 2 palisades (top, right edges of (0,4))
    expect(dennis.farmyard.palisades.length).toBe(2)
    // 2 internal fences
    expect(dennis.farmyard.fences.length).toBe(2)
    // Pasture is fully enclosed
    expect(dennis.farmyard.pastures.length).toBe(1)

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['wood-palisades-b030'],
        wood: 9, // 15 - 2 (internal) - 4 (2 palisades * 2 wood)
        food: 2,
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 4 }] }],
        },
      },
    })
  })

  test('palisades do not count against 15-fence limit', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['wood-palisades-b030'],
        wood: 30,
      },
      actionSpaces: ['Fencing'],
    })
    game.run()

    t.choose(game, 'Fencing')

    // Build a pasture at (0,4) — 2 edge fences (palisades) + 2 internal
    t.action(game, 'build-pasture', { spaces: [{ row: 0, col: 4 }] })
    t.choose(game, 'Build another pasture')

    // Build another pasture at (0,3) — 1 edge fence (palisade) + 2 internal (shares 1 fence with (0,4))
    t.action(game, 'build-pasture', { spaces: [{ row: 0, col: 3 }] })
    t.choose(game, 'Done building fences')

    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Clay Pit')

    const dennis = game.players.byName('dennis')

    // Palisades don't count in getFenceCount()
    expect(dennis.getFenceCount()).toBe(4) // only internal fences
    expect(dennis.farmyard.palisades.length).toBe(3) // 2 from (0,4) + 1 from (0,3)
  })
})
