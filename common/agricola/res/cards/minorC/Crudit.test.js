const t = require('../../../testutil_v2.js')

describe('Crudité', () => {
  test('buy 1 vegetable for 3 food when played', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['crudite-c057'],
        food: 3,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Crudité')
    t.choose(game, 'Buy 1 vegetable for 3 food')

    t.testBoard(game, {
      dennis: {
        food: 1,        // 3 + 1 (Meeting Place) - 3 (Crudité) = 1
        vegetables: 1,  // from Crudité
        minorImprovements: ['crudite-c057'],
      },
    })
  })

  test('discard 1 vegetable from field for 4 food', () => {
    const game = t.fixture({ cardSets: ['minorC'] })
    t.setBoard(game, {
      round: 2,
      dennis: {
        minorImprovements: ['crudite-c057'],
        food: 2,
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'vegetables', cropCount: 2 },
          ],
        },
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const action = actions.find(a => a.cardName === 'Crudité')
    expect(action).toBeDefined()

    t.anytimeAction(game, action)

    t.testBoard(game, {
      dennis: {
        food: 6,  // 2 + 4
        minorImprovements: ['crudite-c057'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'vegetables', cropCount: 1 },
          ],
        },
      },
    })
  })

  test('not available without vegetable field with 2+ crops', () => {
    const game = t.fixture({ cardSets: ['minorC'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['crudite-c057'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'vegetables', cropCount: 1 },
          ],
        },
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Crudité')).toBe(false)
  })
})
