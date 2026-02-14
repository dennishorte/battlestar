const t = require('../../../testutil_v2.js')

describe('Roll-Over Plow', () => {
  test('clear a planted field and plow a new one', () => {
    const game = t.fixture({ cardSets: ['minorC'] })
    t.setBoard(game, {
      round: 2,
      dennis: {
        minorImprovements: ['roll-over-plow-c018'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 3 },
            { row: 0, col: 3, crop: 'grain', cropCount: 2 },
            { row: 0, col: 4, crop: 'vegetables', cropCount: 1 },
          ],
        },
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const action = actions.find(a => a.cardName === 'Roll-Over Plow')
    expect(action).toBeDefined()

    t.anytimeAction(game, action)
    // Choose field to clear
    t.choose(game, '0,4 (vegetables x1)')
    // Choose space to plow
    t.choose(game, '1,2')

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['roll-over-plow-c018'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 3 },
            { row: 0, col: 3, crop: 'grain', cropCount: 2 },
            { row: 0, col: 4 },  // cleared
            { row: 1, col: 2 },  // newly plowed
          ],
        },
      },
    })
  })

  test('not available with fewer than 3 planted fields', () => {
    const game = t.fixture({ cardSets: ['minorC'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['roll-over-plow-c018'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 3 },
            { row: 0, col: 3, crop: 'grain', cropCount: 2 },
          ],
        },
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Roll-Over Plow')).toBe(false)
  })

  test('not available with no valid plow spaces', () => {
    const game = t.fixture({ cardSets: ['minorC'] })
    t.setBoard(game, {
      round: 2,
      dennis: {
        minorImprovements: ['roll-over-plow-c018'],
        farmyard: {
          fields: [
            { row: 0, col: 1, crop: 'grain', cropCount: 3 },
            { row: 0, col: 2, crop: 'grain', cropCount: 2 },
            { row: 0, col: 3, crop: 'vegetables', cropCount: 1 },
            { row: 0, col: 4 },
            { row: 1, col: 1 },
            { row: 1, col: 2 },
            { row: 1, col: 3 },
            { row: 1, col: 4 },
            { row: 2, col: 0 },
            { row: 2, col: 1 },
            { row: 2, col: 2 },
            { row: 2, col: 3 },
            { row: 2, col: 4 },
          ],
        },
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Roll-Over Plow')).toBe(false)
  })
})
