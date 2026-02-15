const t = require('../../../testutil_v2.js')

describe('Winter Caretaker', () => {
  // Card text: "When you play this card, you immediately get 1 grain.
  // At the end of each harvest, you can buy exactly 1 vegetable for 2 food."

  test('onPlay gives 1 grain', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['winter-caretaker-c113'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Winter Caretaker')

    t.testBoard(game, {
      dennis: {
        food: 10,
        grain: 1,
        occupations: ['winter-caretaker-c113'],
      },
    })
  })
})
