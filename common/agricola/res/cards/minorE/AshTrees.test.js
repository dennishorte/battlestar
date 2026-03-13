const t = require('../../../testutil_v2.js')

describe('Ash Trees', () => {
  test('onPlay places up to 5 fences from supply onto card', () => {
    const game = t.fixture({ cardSets: ['minorE', 'test'] })

    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['ash-trees-e074'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 1 },
            { row: 0, col: 3, crop: 'grain', cropCount: 1 },
          ],
        },
      },
      actionSpaces: ['Major Improvement'],
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Minor Improvement.Ash Trees')

    expect(game.cardState('ash-trees-e074').storedFences).toBe(5)
    // Fences moved from supply to card
    const dennis = game.players.byName('dennis')
    expect(dennis.getFencesInSupply()).toBe(15 - 5)
  })

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

  test('fence supply is correct after using fences from card', () => {
    const game = t.fixture({ cardSets: ['minorE', 'test'] })

    game.testSetBreakpoint('initialization-complete', () => {
      game.cardState('ash-trees-e074').storedFences = 5
      game.players.byName('dennis').usedFences = 5
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

    const dennis = game.players.byName('dennis')
    expect(dennis.usedFences).toBe(5)
    expect(dennis.getFencesInSupply()).toBe(10)

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
    expect(game.cardState('ash-trees-e074').storedFences).toBe(1)
    // Fences moved from card to board — supply stays the same
    expect(dennis.getFencesInSupply()).toBe(10)
  })
})
