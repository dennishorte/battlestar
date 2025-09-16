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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Galileo Galilei')

    t.testChoices(request, [5,6])

    request = t.choose(game, request, 6)

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Galileo Galilei')
    request = t.choose(game, request, 5)

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Galileo Galilei')
    request = t.choose(game, request, 5)
    request = t.choose(game, request, 'auto')

    t.testBoard(game, {
      dennis: {
        green: ['Galileo Galilei'],
        hand: ['Tools', 'Canning'],
        forecast: ['Coal']
      },
    })

  })
})
