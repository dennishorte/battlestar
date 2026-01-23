Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Collaboration', () => {
  test('demand', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: ['Collaboration'],
      },
      decks: {
        base: {
          9: ['Computers', 'Services'],
        },
      },
    })
    game.run()
    t.choose(game, 'Dogma.Collaboration')
    t.choose(game, 'Computers')

    t.testBoard(game, {
      dennis: {
        green: ['Collaboration'],
        blue: ['Computers'],
      },
      micah: {
        purple: ['Services'],
      },
    })
  })

  test('win condition (10)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: ['Collaboration', 'Mapmaking', 'Banking', 'Navigation', 'Databases', 'Sailing', 'Paper', 'Satellites', 'Clothing', 'Currency'],
      },
      decks: {
        base: {
          9: ['Computers', 'Services'],
        },
      },
    })
    game.run()
    t.choose(game, 'Dogma.Collaboration')
    const result = t.choose(game, 'Computers')

    t.testGameOver(result, 'dennis', 'Collaboration')
  })
})
