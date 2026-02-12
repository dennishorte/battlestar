const t = require('../../../testutil_v2.js')

describe('Trident', () => {
  test('gives 3 food when played in round 3', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 3,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['trident-d007'],
        wood: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Trident')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 4, // 3 from Trident + 1 from Meeting Place
        wood: 0,
        minorImprovements: ['trident-d007'],
      },
    })
  })

  test('gives 5 food when played in round 9', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 9,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['trident-d007'],
        wood: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Trident')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 6, // 5 from Trident + 1 from Meeting Place
        wood: 0,
        minorImprovements: ['trident-d007'],
      },
    })
  })
})
