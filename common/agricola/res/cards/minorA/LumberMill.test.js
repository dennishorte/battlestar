const t = require('../../../testutil_v2.js')

describe('Lumber Mill', () => {
  test('reduces wood cost of minor improvement by 1, making free play possible', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['lumber-mill-a075'],
        hand: ['hod-a077'], // Hod costs wood:1, reduced to wood:0
      },
    })
    game.run()

    // Dennis plays Hod for free (wood:1 - 1 = wood:0) despite having 0 wood
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Hod')

    t.testBoard(game, {
      dennis: {
        food: 1, // +1 from Meeting Place
        clay: 1, // Hod onPlay gives 1 clay
        hand: [],
        minorImprovements: ['hod-a077', 'lumber-mill-a075'],
      },
    })
  })

  test('without Lumber Mill, cannot play wood-cost card with 0 wood', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 10,
      dennis: {
        hand: ['hod-a077'], // Hod costs wood:1, player has 0 wood
      },
    })
    game.run()

    // Dennis takes Meeting Place but can't afford Hod (no discount)
    // buyImprovement auto-skips when nothing is affordable
    t.choose(game, 'Meeting Place')

    t.testBoard(game, {
      dennis: {
        food: 1,
        hand: ['hod-a077'], // still in hand
      },
    })
  })
})
