Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Canal Building', () => {
  test('exchange cards', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Canal Building'],
        hand: ['Industrialization', 'Tools'],
        score: ['Chemistry', 'Steam Engine', 'Colonialism'],
      },
    })
    game.run()
    t.choose(game, 'Dogma.Canal Building')
    t.choose(game, 'Exchange highest cards between hand and score pile')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Canal Building'],
        hand: ['Chemistry', 'Steam Engine', 'Tools'],
        score: ['Colonialism', 'Industrialization'],
      },
    })
  })

  test('junk deck', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Canal Building'],
        hand: ['Industrialization', 'Tools'],
        score: ['Chemistry', 'Steam Engine', 'Colonialism'],
      },
    })
    game.run()
    t.choose(game, 'Dogma.Canal Building')
    t.choose(game, 'Junk all cards in the 3 deck')

    t.testIsSecondPlayer(game)
    t.testDeckIsJunked(game, 3)
    t.testBoard(game, {
      dennis: {
        yellow: ['Canal Building'],
        hand: ['Industrialization', 'Tools'],
        score: ['Chemistry', 'Steam Engine', 'Colonialism'],
      },
    })
  })
})
