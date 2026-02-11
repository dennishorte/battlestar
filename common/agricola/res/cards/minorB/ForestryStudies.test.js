const t = require('../../../testutil_v2.js')

describe('Forestry Studies', () => {
  test('accept offer to return 2 wood and play occupation free', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['forestry-studies-b028'],
        hand: ['test-occupation-1'],
      },
    })
    game.run()

    // Dennis takes Forest (3 wood) — triggers ForestryStudies offer
    t.choose(game, 'Forest')
    // Accept the offer (costs 2 wood)
    t.choose(game, 'Return 2 wood to play 1 occupation free')
    // Choose occupation
    t.choose(game, 'Test Occupation 1')

    t.testBoard(game, {
      dennis: {
        wood: 1, // 3 from Forest - 2 returned
        occupations: ['test-occupation-1'],
        minorImprovements: ['forestry-studies-b028'],
      },
    })
  })

  test('decline offer', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['forestry-studies-b028'],
        hand: ['test-occupation-1'],
      },
    })
    game.run()

    t.choose(game, 'Forest')
    // Decline the offer
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        wood: 3, // kept all wood
        hand: ['test-occupation-1'],
        minorImprovements: ['forestry-studies-b028'],
      },
    })
  })
})
