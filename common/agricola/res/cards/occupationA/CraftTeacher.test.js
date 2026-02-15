const t = require('../../../testutil_v2.js')

describe('Craft Teacher', () => {
  test('onBuildMajor offers up to 2 free occupations after building Joinery', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Major Improvement'],
      dennis: {
        occupations: ['craft-teacher-a131'],
        hand: ['test-occupation-1', 'test-occupation-2'],
        wood: 2,
        stone: 2,
        majorImprovements: ['fireplace-2'],
      },
    })
    game.run()

    t.choose(game, 'Major Improvement')  // take action
    t.choose(game, 'Major Improvement.Joinery (joinery)')
    t.choose(game, 'Test Occupation 1')
    t.choose(game, 'Test Occupation 2')

    t.testBoard(game, {
      dennis: {
        occupations: ['craft-teacher-a131', 'test-occupation-1', 'test-occupation-2'],
        wood: 0,
        stone: 0,
        majorImprovements: ['fireplace-2', 'joinery'],
      },
    })
  })

  test('allows skipping free occupations', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Major Improvement'],
      dennis: {
        occupations: ['craft-teacher-a131'],
        hand: ['test-occupation-1'],
        wood: 2,
        stone: 2,
        majorImprovements: ['fireplace-2'],
      },
    })
    game.run()

    t.choose(game, 'Major Improvement')  // take action
    t.choose(game, 'Major Improvement.Joinery (joinery)')
    t.choose(game, 'Do not play an occupation')

    t.testBoard(game, {
      dennis: {
        occupations: ['craft-teacher-a131'],
        hand: ['test-occupation-1'],
        wood: 0,
        stone: 0,
        majorImprovements: ['fireplace-2', 'joinery'],
      },
    })
  })
})
