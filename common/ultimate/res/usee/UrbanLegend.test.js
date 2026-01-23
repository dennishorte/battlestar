Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Urban Legend', () => {

  test('dogma: splay and draw', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Urban Legend', 'Monotheism'],
        blue: ['Tools'],
        red: ['Coal'],
      },
      decks: {
        base: {
          9: ['Computers'],
        },
        usee: {
          9: ['Consulting'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Urban Legend')
    request = t.choose(game, 'purple')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Urban Legend', 'Monotheism'],
          splay: 'up',
        },
        blue: ['Tools'],
        red: ['Coal'],
        hand: ['Computers', 'Consulting'],
      },
    })
  })

  test('dogma: instant win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Urban Legend', 'Monotheism'],
        blue: ['Chemistry'],
        red: ['Coal'],
        green: ['Corporations'],
        yellow: ['Canning'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Urban Legend')

    t.testGameOver(request, 'dennis', 'Urban Legend')
  })

})
