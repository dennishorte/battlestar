const t = require('../../../testutil_v2.js')

describe('Herring Pot', () => {
  test('schedules food when fishing action is used', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['herring-pot-b047'],
        clay: 1, // card cost
      },
    })
    game.run()

    // Dennis plays Herring Pot
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Herring Pot')
    // Micah takes action
    t.choose(game, 'Forest')
    // Dennis uses Fishing — triggers onAction
    t.choose(game, 'Fishing')

    t.testBoard(game, {
      dennis: {
        food: 2, // 1 from Meeting Place + 1 from Fishing
        scheduled: { food: { 2: 1, 3: 1, 4: 1 } },
        minorImprovements: ['herring-pot-b047'],
      },
    })
  })

  test('does not schedule food on non-fishing actions', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['herring-pot-b047'],
      },
    })
    game.run()

    // Dennis takes a non-fishing action
    t.choose(game, 'Day Laborer')

    // No scheduled food since fishing wasn't used
    expect(game.state.scheduledFood).toBeUndefined()
  })
})
