const t = require('../../../testutil_v2.js')

describe('Sheep Agent', () => {
  test('allows holding sheep on occupation cards', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Sheep Market', accumulated: 3 }],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['sheep-agent-d086', 'test-occupation-1'],
      },
    })
    game.run()

    // Take 3 sheep: 1 pet + 2 on cards (1 per occupation)
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['sheep-agent-d086', 'test-occupation-1'],
        pet: 'sheep',
        animals: { sheep: 3 },
      },
    })
  })

  test('capacity scales with number of occupations', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Sheep Market', accumulated: 2 }],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['sheep-agent-d086'],
      },
    })
    game.run()

    // Take 2 sheep: 1 pet + 1 on SheepAgent card (only 1 occupation)
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['sheep-agent-d086'],
        pet: 'sheep',
        animals: { sheep: 2 },
      },
    })
  })
})
