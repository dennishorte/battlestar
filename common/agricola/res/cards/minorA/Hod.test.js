const t = require('../../../testutil_v2.js')

describe('Hod', () => {
  test('gives 2 clay when another player uses Pig Market', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        minorImprovements: ['hod-a077'],
      },
      actionSpaces: ['Pig Market'],
    })
    game.run()

    t.choose(game, 'Pig Market')   // micah takes Pig Market
    t.choose(game, 'Place Animals') // micah places boar

    t.testBoard(game, {
      dennis: {
        clay: 2, // 2 from Hod triggered by micah's Pig Market
        minorImprovements: ['hod-a077'],
      },
      micah: {
        pet: 'boar',
        animals: { boar: 1 },
      },
    })
  })

  test('gives 2 clay when owner uses Pig Market', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['hod-a077'],
      },
      actionSpaces: ['Pig Market'],
    })
    game.run()

    t.choose(game, 'Pig Market')   // dennis takes Pig Market
    t.choose(game, 'Place Animals') // dennis places boar

    t.testBoard(game, {
      dennis: {
        clay: 2, // 2 from Hod
        pet: 'boar',
        animals: { boar: 1 },
        minorImprovements: ['hod-a077'],
      },
    })
  })

  test('does not give clay for non-boar actions', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['hod-a077'],
      },
    })
    game.run()

    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        wood: 3, // from Forest
        minorImprovements: ['hod-a077'],
      },
    })
  })
})
