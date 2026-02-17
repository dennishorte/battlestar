const t = require('../../../testutil_v2.js')

describe('Ox Skull', () => {
  test('gives 1 food on play', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['ox-skull-e037'],
        pet: 'cattle',
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Ox Skull')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 2, // 1 from Ox Skull + 1 from Meeting Place
        pet: 'cattle',
        animals: { cattle: 1 },
        minorImprovements: ['ox-skull-e037'],
      },
    })
  })

  test('gives 0 bonus points when player has cattle', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['ox-skull-e037'],
        pet: 'cattle',
      },
    })
    game.run()

    // Score: fields(-1) pastures(-1) grain(-1) veg(-1) sheep(-1) boar(-1) cattle(+1)
    //   rooms(0) family(6) unused(-13) + 0 bonus (has cattle) = -12
    t.testBoard(game, {
      dennis: {
        minorImprovements: ['ox-skull-e037'],
        pet: 'cattle',
        animals: { cattle: 1 },
        score: -12,
      },
    })
  })
})
