const t = require('../../../testutil_v2.js')

describe('Wood Pile', () => {
  test('gives wood equal to people on accumulation spaces', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['wood-pile-b004'],
      },
    })
    game.run()

    // dennis places a worker on Forest (accumulating space)
    t.choose(game, 'Forest')
    // micah takes any action
    t.choose(game, 'Clay Pit')
    // dennis plays Wood Pile from Meeting Place — has 1 person on accumulation space
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Wood Pile')

    t.testBoard(game, {
      dennis: {
        wood: 4, // 3 from Forest + 1 from Wood Pile (1 person on accumulation)
        food: 1, // from Meeting Place
        minorImprovements: ['wood-pile-b004'],
      },
      micah: {
        clay: 1, // from Clay Pit
      },
    })
  })

  test('gives 0 wood with no people on accumulation spaces', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['wood-pile-b004'],
      },
    })
    game.run()

    // dennis takes Meeting Place (non-accumulating) and plays Wood Pile
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Wood Pile')

    t.testBoard(game, {
      dennis: {
        wood: 0, // no people on accumulation spaces
        food: 1, // from Meeting Place
        minorImprovements: ['wood-pile-b004'],
      },
    })
  })
})
