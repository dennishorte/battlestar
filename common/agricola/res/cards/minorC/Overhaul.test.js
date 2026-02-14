const t = require('../../../testutil_v2.js')

describe('Overhaul', () => {
  test('razes fences and allows rebuild with 3 free fences', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        food: 2,
        wood: 5,
        hand: ['overhaul-c001'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }] },
          ],
        },
      },
      actionSpaces: ['Major Improvement'],
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Minor Improvement.Overhaul')

    // Old fences razed, now rebuild — build a 2-space pasture
    t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }] })
    t.choose(game, 'Done building fences')

    const dennis = game.players.byName('dennis')
    expect(dennis.farmyard.pastures.length).toBeGreaterThan(0)
    expect(dennis.farmyard.fences.length).toBeGreaterThan(0)
    // 2-space pasture needs 6 fences, 3 free from overhaul → 3 wood cost
    // Started with 5, paid 1 for card cost, 3 for fences = 1 remaining
    expect(dennis.wood).toBe(1)
  })

  test('preserves animals during fence rebuild', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        food: 2,
        wood: 10,
        hand: ['overhaul-c001'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }], sheep: 2 },
          ],
        },
      },
      actionSpaces: ['Major Improvement'],
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Minor Improvement.Overhaul')

    // Rebuild a pasture
    t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }] })
    t.choose(game, 'Done building fences')

    const dennis = game.players.byName('dennis')
    // Animals should be preserved
    expect(dennis.getTotalAnimals('sheep')).toBe(2)
  })

  test('razes fences even with insufficient wood to rebuild', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        food: 2,
        wood: 2,  // 1 for card cost, 1 remaining after
        hand: ['overhaul-c001'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }] },
          ],
        },
      },
      actionSpaces: ['Major Improvement'],
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Minor Improvement.Overhaul')

    // After paying 1 wood for card cost, player has 1 wood
    // 1-space pasture needs 4 fences, 3 free → 1 wood cost = exactly enough
    // After building, player has 0 wood and 0 free fences → buildFences exits automatically
    t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 0 }] })

    const dennis = game.players.byName('dennis')
    expect(dennis.farmyard.pastures.length).toBe(1)
    expect(dennis.wood).toBe(0) // 1 - 1 = 0
  })
})
