const t = require('../../../testutil_v2.js')

describe('Land Register', () => {
  test('scores 2 VP when no unused spaces', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 10,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['land-register-e034'],
        wood: 1,
        farmyard: {
          rooms: [
            { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 },
            { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 },
            { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 }, { row: 2, col: 4 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Land Register')

    const dennis = game.players.byName('dennis')
    const card = game.cards.byId('land-register-e034')
    expect(card.definition.getEndGamePoints(dennis)).toBe(2)
  })

  test('scores 0 VP when there are unused spaces', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 10,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['land-register-e034'],
        wood: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Land Register')

    const dennis = game.players.byName('dennis')
    const card = game.cards.byId('land-register-e034')
    // Default 2 rooms, 13 unused spaces → 0 VP
    expect(card.definition.getEndGamePoints(dennis)).toBe(0)
  })
})
