const t = require('../../../testutil_v2.js')

describe('Trellises', () => {
  test('schedules food for each fence built when played', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['trellises-a047'],
        wood: 1,
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }] }],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Trellises')

    // 2-space pasture uses 6 fences → schedules food for 6 rounds
    t.testBoard(game, {
      dennis: {
        food: 1,
        hand: [],
        minorImprovements: ['trellises-a047'],
        scheduled: { food: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1 } },
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }] }],
        },
      },
    })
  })
})
