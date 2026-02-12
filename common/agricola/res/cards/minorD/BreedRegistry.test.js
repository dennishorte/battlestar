const t = require('../../../testutil_v2.js')

describe('Breed Registry', () => {
  test('scores 3 VP when played (default tracking)', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['breed-registry-d036'],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Breed Registry')

    // onPlay sets tracking; getEndGamePoints returns 3 (no sheep gained/lost)
    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1,
        score: -11,
        minorImprovements: ['breed-registry-d036'],
      },
    })
  })
})
