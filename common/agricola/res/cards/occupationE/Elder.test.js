const t = require('../../../testutil_v2.js')

describe('Elder', () => {
  test('stub card: no crash when placed in occupations', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['elder-e096'],
      },
    })
    game.run()

    // Take any action to verify game runs normally with Elder in play
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 2,
        occupations: ['elder-e096'],
      },
    })
  })
})
