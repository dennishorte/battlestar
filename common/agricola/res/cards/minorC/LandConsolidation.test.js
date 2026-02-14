const t = require('../../../testutil_v2.js')

describe('Land Consolidation', () => {
  test('exchange 3 grain in field for 1 vegetable', () => {
    const game = t.fixture({ cardSets: ['minorC'] })
    t.setBoard(game, {
      round: 2,
      dennis: {
        minorImprovements: ['land-consolidation-c069'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 3 },
          ],
        },
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const action = actions.find(a => a.cardName === 'Land Consolidation')
    expect(action).toBeDefined()

    t.anytimeAction(game, action)

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['land-consolidation-c069'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'vegetables', cropCount: 1 },
          ],
        },
      },
    })
  })

  test('not available without grain field with 3+ crops', () => {
    const game = t.fixture({ cardSets: ['minorC'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['land-consolidation-c069'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 2 },
          ],
        },
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Land Consolidation')).toBe(false)
  })

  test('not available without any fields', () => {
    const game = t.fixture({ cardSets: ['minorC'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['land-consolidation-c069'],
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Land Consolidation')).toBe(false)
  })
})
