const t = require('../../../testutil_v2.js')

describe("Child's Toy", () => {
  test('is worth 2 VP and increases newborn food cost', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['childs-toy-e030'],
        wood: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, "Minor Improvement.Child's Toy")

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1,
        minorImprovements: ['childs-toy-e030'],
      },
    })

    const card = game.cards.byId('childs-toy-e030')
    expect(card.definition.vps).toBe(2)
    expect(card.definition.modifyNewbornFoodCost(game, null, 1)).toBe(2)
  })
})
