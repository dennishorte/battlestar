const t = require('../../../testutil_v2.js')

describe('Beanfield', () => {
  test('creates a vegetable-only virtual field when played', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['beanfield-b068'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
        food: 1, // card cost
      },
    })
    game.run()

    // Play Beanfield via Meeting Place → creates virtual field
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Beanfield')
    // Micah
    t.choose(game, 'Day Laborer')
    // Dennis
    t.choose(game, 'Forest')
    // Micah
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        food: 1, // 0 (food - 1 cost) + 1 from Meeting Place
        wood: 3, // from Forest
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['beanfield-b068'],
      },
    })

    // Verify virtual field was created
    const dennis = game.players.byName('dennis')
    expect(dennis.virtualFields).toHaveLength(1)
    expect(dennis.virtualFields[0].cropRestriction).toBe('vegetables')
    expect(dennis.virtualFields[0].cardId).toBe('beanfield-b068')
  })
})
