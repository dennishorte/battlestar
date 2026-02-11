const t = require('../../../testutil_v2.js')

describe('Acorns Basket', () => {
  test('schedules 1 boar on each of the next 2 rounds', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['acorns-basket-b084'],
        reed: 1, // card cost
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'], // prereq: 3 occupations
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Acorns Basket')

    t.testBoard(game, {
      dennis: {
        food: 1, // from Meeting Place
        scheduled: { boar: { 2: 1, 3: 1 } },
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['acorns-basket-b084'],
      },
    })
  })
})
