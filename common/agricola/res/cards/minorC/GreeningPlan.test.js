const t = require('../../../testutil_v2.js')

describe('Greening Plan', () => {
  test('scores 1 VP for 2 empty fields', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['greening-plan-c033'],
        food: 3,
        farmyard: {
          fields: [
            { row: 2, col: 0 },
            { row: 2, col: 1 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Greening Plan')

    const dennis = game.players.byName('dennis')
    const card = game.cards.byId('greening-plan-c033')
    expect(card.definition.getEndGamePoints(dennis)).toBe(1)
  })

  test('scores 5 VP for 6 empty fields', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['greening-plan-c033'],
        food: 3,
        farmyard: {
          fields: [
            { row: 2, col: 0 },
            { row: 2, col: 1 },
            { row: 2, col: 2 },
            { row: 2, col: 3 },
            { row: 2, col: 4 },
            { row: 1, col: 4 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Greening Plan')

    const dennis = game.players.byName('dennis')
    const card = game.cards.byId('greening-plan-c033')
    expect(card.definition.getEndGamePoints(dennis)).toBe(5)
  })

  test('scores 0 VP for fewer than 2 empty fields', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['greening-plan-c033'],
        food: 3,
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 2 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Greening Plan')

    const dennis = game.players.byName('dennis')
    const card = game.cards.byId('greening-plan-c033')
    // 1 field total, but it's sown, so 0 empty fields
    expect(card.definition.getEndGamePoints(dennis)).toBe(0)
  })
})
