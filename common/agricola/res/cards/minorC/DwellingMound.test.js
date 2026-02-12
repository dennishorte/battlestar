const t = require('../../../testutil_v2.js')

describe('Dwelling Mound', () => {
  test('is worth 3 VP and modifies field cost', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['dwelling-mound-c037'],
        food: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Dwelling Mound')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // 1 start + 1 MP - 1 cost
        minorImprovements: ['dwelling-mound-c037'],
      },
    })

    // Verify static VP and field cost modifier
    const card = game.cards.byId('dwelling-mound-c037')
    expect(card.definition.vps).toBe(3)
    expect(card.definition.modifyFieldCost({}, { food: 0 })).toEqual({ food: 1 })
    expect(card.definition.modifyFieldCost({}, {})).toEqual({ food: 1 })
  })
})
