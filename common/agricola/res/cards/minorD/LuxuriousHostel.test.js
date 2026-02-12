const t = require('../../../testutil_v2.js')

describe('Luxurious Hostel', () => {
  test('scores 4 VP when stone rooms > family members', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 10,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['luxurious-hostel-d034'],
        wood: 1,
        clay: 2,
        roomType: 'stone',
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Luxurious Hostel')

    const dennis = game.players.byName('dennis')
    const card = game.cards.byId('luxurious-hostel-d034')
    // 3 stone rooms > 2 family members → 4 VP
    expect(card.definition.getEndGamePoints(dennis)).toBe(4)
  })

  test('scores 0 VP when rooms equal family members', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 10,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['luxurious-hostel-d034'],
        wood: 1,
        clay: 2,
        roomType: 'stone',
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Luxurious Hostel')

    const dennis = game.players.byName('dennis')
    const card = game.cards.byId('luxurious-hostel-d034')
    // 2 rooms = 2 family members → 0 VP
    expect(card.definition.getEndGamePoints(dennis)).toBe(0)
  })
})
