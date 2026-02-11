const t = require('../../../testutil_v2.js')

describe('Storage Barn', () => {
  test('gives resources based on owned major improvements', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['storage-barn-a006'],
        majorImprovements: ['well', 'joinery', 'pottery', 'basketmakers-workshop'],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Storage Barn')

    t.testBoard(game, {
      dennis: {
        food: 1, // +1 Meeting Place
        stone: 1, // from Well
        wood: 1, // from Joinery
        clay: 1, // from Pottery
        reed: 1, // from Basketmaker's Workshop
        hand: [],
        minorImprovements: ['storage-barn-a006'],
        majorImprovements: ['well', 'joinery', 'pottery', 'basketmakers-workshop'],
      },
    })
  })

  test('gives stone for Well only', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['storage-barn-a006'],
        majorImprovements: ['well'],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Storage Barn')

    t.testBoard(game, {
      dennis: {
        food: 1, // +1 Meeting Place
        stone: 1, // from Well
        hand: [],
        minorImprovements: ['storage-barn-a006'],
        majorImprovements: ['well'],
      },
    })
  })

  test('gives nothing without matching improvements', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['storage-barn-a006'],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Storage Barn')

    t.testBoard(game, {
      dennis: {
        food: 1, // +1 Meeting Place only
        hand: [],
        minorImprovements: ['storage-barn-a006'],
      },
    })
  })
})
