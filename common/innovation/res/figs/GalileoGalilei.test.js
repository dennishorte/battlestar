Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Galileo Galilei', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Galileo Galilei'],
      },
      decks: {
        base: {
          6: ['Industrialization']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Galileo Galilei')

    t.testChoices(request2, [5,6])

    const request3 = t.choose(game, request2, 6)

    t.testBoard(game, {
      dennis: {
        green: ['Galileo Galilei'],
        forecast: ['Industrialization']
      },
    })
  })

  test('karma: matches forecast', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Galileo Galilei'],
        forecast: ['Astronomy'],
      },
      decks: {
        base: {
          5: ['Coal']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Galileo Galilei')
    const request3 = t.choose(game, request2, 5)

    t.testBoard(game, {
      dennis: {
        green: ['Galileo Galilei'],
        forecast: ['Coal', 'Astronomy']
      },
    })
  })

  test('karma: does not match forecast', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Galileo Galilei'],
        forecast: ['Canning', 'Tools'],
      },
      decks: {
        base: {
          5: ['Coal']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Galileo Galilei')
    const request3 = t.choose(game, request2, 5)
    const request4 = t.choose(game, request3, 'auto')

    t.testBoard(game, {
      dennis: {
        green: ['Galileo Galilei'],
        hand: ['Tools', 'Canning'],
        forecast: ['Coal']
      },
    })

  })
})
