const t = require('../../../testutil_v2.js')

describe('Field Fences', () => {
  test('builds pasture adjacent to field with discount', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        food: 2,
        wood: 3,
        hand: ['field-fences-c016'],
        farmyard: {
          fields: [{ row: 2, col: 2 }],
        },
      },
      actionSpaces: ['Major Improvement'],
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Minor Improvement.Field Fences')

    // Build pasture at (2,1) — adjacent to field at (2,2)
    // 4 fences needed, 1 adjacent to field (between 2,1 and 2,2) → 3 wood cost
    t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 1 }] })
    t.choose(game, 'Done building fences')

    const dennis = game.players.byName('dennis')
    expect(dennis.farmyard.pastures.length).toBe(1)
    expect(dennis.wood).toBe(0) // 3 - 3 = 0 (1 fence free from field adjacency)
  })

  test('multiple field-adjacent fences all get discount', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        food: 2,
        wood: 2,
        hand: ['field-fences-c016'],
        farmyard: {
          // Connected field group: (1,1)-(1,2)-(2,2), wrapping around pasture space (2,1)
          fields: [
            { row: 1, col: 1 },
            { row: 1, col: 2 },
            { row: 2, col: 2 },
          ],
        },
      },
      actionSpaces: ['Major Improvement'],
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Minor Improvement.Field Fences')

    // Build pasture at (2,1) — adjacent to fields at (1,1) [top] and (2,2) [right]
    // 4 fences needed, 2 adjacent to fields → 2 wood cost
    t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 1 }] })
    t.choose(game, 'Done building fences')

    const dennis = game.players.byName('dennis')
    expect(dennis.farmyard.pastures.length).toBe(1)
    expect(dennis.wood).toBe(0) // 2 - 2 = 0 (2 fences free from field adjacency)
  })

  test('can skip building fences', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        food: 2,
        wood: 4,
        hand: ['field-fences-c016'],
        farmyard: {
          fields: [{ row: 2, col: 2 }],
        },
      },
      actionSpaces: ['Major Improvement'],
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Minor Improvement.Field Fences')

    // Cancel fencing
    t.choose(game, 'Cancel fencing')

    const dennis = game.players.byName('dennis')
    expect(dennis.farmyard.pastures.length).toBe(0)
    expect(dennis.wood).toBe(4) // No wood spent on fences
  })
})
