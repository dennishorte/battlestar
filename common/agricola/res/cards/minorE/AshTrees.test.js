const t = require('../../../testutil_v2.js')

describe('Ash Trees', () => {
  test('fences from card are free when building pasture', () => {
    const game = t.fixture({ cardSets: ['minorE', 'test'] })

    game.testSetBreakpoint('initialization-complete', () => {
      game.cardState('ash-trees-e074').storedFences = 5
    })

    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['ash-trees-e074'],
        wood: 0,
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 1 },
            { row: 0, col: 3, crop: 'grain', cropCount: 1 },
          ],
        },
      },
      actionSpaces: ['Fencing'],
    })
    game.run()

    t.choose(game, 'Fencing')
    t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 0 }] })

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['ash-trees-e074'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 1 },
            { row: 0, col: 3, crop: 'grain', cropCount: 1 },
          ],
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
    // Verify card fence count: 5 - 4 = 1 remaining
    expect(game.cardState('ash-trees-e074').storedFences).toBe(1)
  })

  test('partial free fences — remaining cost paid in wood', () => {
    const game = t.fixture({ cardSets: ['minorE', 'test'] })

    game.testSetBreakpoint('initialization-complete', () => {
      game.cardState('ash-trees-e074').storedFences = 2
    })

    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['ash-trees-e074'],
        wood: 2,
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 1 },
            { row: 0, col: 3, crop: 'grain', cropCount: 1 },
          ],
        },
      },
      actionSpaces: ['Fencing'],
    })
    game.run()

    t.choose(game, 'Fencing')
    t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 0 }] })

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['ash-trees-e074'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 1 },
            { row: 0, col: 3, crop: 'grain', cropCount: 1 },
          ],
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
    expect(game.cardState('ash-trees-e074').storedFences).toBe(0)
  })
})
