const t = require('../../../testutil_v2.js')

describe('Heirloom', () => {
  test('is worth 2 VP', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['heirloom-e029'],
      },
    })
    game.run()

    // Heirloom prereq: personOnAction "day-laborer" — take Day Laborer first
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')         // micah
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Heirloom')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 3, // 2 (Day Laborer) + 1 (Meeting Place)
        score: -12,
        minorImprovements: ['heirloom-e029'],
      },
    })
  })
})
