const t = require('../../../testutil_v2.js')

describe('Renovation Materials', () => {
  test('immediately renovates to clay for free when played', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['renovation-materials-e002'],
        clay: 3, reed: 1,  // card cost
      },
    })
    game.run()

    // Play Renovation Materials from hand via Meeting Place
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Renovation Materials')

    t.testBoard(game, {
      dennis: {
        roomType: 'clay',
        food: 1,  // Meeting Place gives 1 food
        minorImprovements: ['renovation-materials-e002'],
      },
    })
  })
})
