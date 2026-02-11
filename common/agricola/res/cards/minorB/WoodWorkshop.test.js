const t = require('../../../testutil_v2.js')

describe('Wood Workshop', () => {
  test('gives 1 wood when building an improvement', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['wood-workshop-b075'],
        occupations: ['test-occupation-1'],
        hand: ['test-minor-1'],
      },
    })
    game.run()

    // Dennis plays test-minor-1 → onBuildImprovement fires → 1 wood from Wood Workshop
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Test Minor 1')
    // Micah
    t.choose(game, 'Day Laborer')
    // Dennis
    t.choose(game, 'Forest')
    // Micah
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        food: 1, // from Meeting Place
        wood: 4, // 1 from Wood Workshop + 3 from Forest
        occupations: ['test-occupation-1'],
        minorImprovements: ['wood-workshop-b075', 'test-minor-1'],
      },
    })
  })

  test('no wood when not building an improvement', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['wood-workshop-b075'],
        occupations: ['test-occupation-1'],
      },
    })
    game.run()

    // Dennis takes actions but doesn't build improvements
    t.choose(game, 'Meeting Place')
    // no minors in hand, so no improvement offer
    // Micah
    t.choose(game, 'Day Laborer')
    // Dennis
    t.choose(game, 'Forest')
    // Micah
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        food: 1, // from Meeting Place only
        wood: 3, // from Forest only (no Wood Workshop bonus)
        occupations: ['test-occupation-1'],
        minorImprovements: ['wood-workshop-b075'],
      },
    })
  })
})
