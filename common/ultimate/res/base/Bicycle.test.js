Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Bicycle', () => {
  test('yes', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: ['Bicycle'],
        hand: ['Industrialization', 'Tools'],
        score: ['Chemistry'],
      },
    })
    game.run()
    t.choose(game, 'Dogma.Bicycle')
    t.choose(game, 'yes')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Bicycle'],
        hand: ['Chemistry'],
        score: ['Industrialization', 'Tools'],
      },
    })
  })

  test('no', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: ['Bicycle'],
        hand: ['Industrialization', 'Tools'],
        score: ['Chemistry'],
      },
    })
    game.run()
    t.choose(game, 'Dogma.Bicycle')
    t.choose(game, 'no')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Bicycle'],
        hand: ['Industrialization', 'Tools'],
        score: ['Chemistry'],
      },
    })
  })
})
