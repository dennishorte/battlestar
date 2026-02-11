const t = require('../../../testutil_v2.js')

describe('Large Greenhouse', () => {
  test('schedules vegetables at offset rounds when played', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['large-greenhouse-a069'],
        wood: 2,
        occupations: ['test-occupation-1', 'test-occupation-2'],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Large Greenhouse')

    t.testBoard(game, {
      dennis: {
        food: 1,
        hand: [],
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['large-greenhouse-a069'],
        scheduled: { vegetables: { 6: 1, 9: 1, 11: 1 } },
      },
    })
  })
})
