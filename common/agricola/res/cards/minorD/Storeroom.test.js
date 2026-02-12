const t = require('../../../testutil_v2.js')

describe('Storeroom', () => {
  test('scores 0.5 VP per grain+vegetable pair (rounded up)', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 10,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['storeroom-d031'],
        wood: 1,
        stone: 2,
        grain: 3,
        vegetables: 2,
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 2 },
            { row: 2, col: 1, crop: 'vegetables', cropCount: 1 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Storeroom')

    const dennis = game.players.byName('dennis')
    const card = game.cards.byId('storeroom-d031')
    // Total grain: 3 supply + 2 fields = 5
    // Total vegetables: 2 supply + 1 fields = 3
    // Pairs: min(5, 3) = 3
    // Points: ceil(3 / 2) = 2
    expect(card.definition.getEndGamePoints(dennis)).toBe(2)
  })

  test('scores 0 VP when missing one crop type', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 10,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['storeroom-d031'],
        wood: 1,
        stone: 2,
        grain: 5,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Storeroom')

    const dennis = game.players.byName('dennis')
    const card = game.cards.byId('storeroom-d031')
    // 0 vegetables → 0 pairs → 0 points
    expect(card.definition.getEndGamePoints(dennis)).toBe(0)
  })
})
