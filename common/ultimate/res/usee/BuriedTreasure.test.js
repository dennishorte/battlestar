Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Buried Treasure', () => {

  test('dogma: transfer 3', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Buried Treasure'],
        score: ['Coal', 'Statistics', 'The Wheel']
      },
      micah: {
        score: ['Astronomy', 'Metric System'],
      },
      achievements: ['The Wheel', 'Agriculture'],
      decks: {
        usee: {
          5: ['Pen Name'],
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Buried Treasure')
    request = t.choose(game, request, 5)
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Buried Treasure'],
        score: ['The Wheel'],
      },
      micah: {
        score: ['Metric System'],
      },
    })
  })


  test('dogma: transfer 4', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Buried Treasure'],
        score: ['Coal', 'Statistics', 'The Wheel']
      },
      micah: {
        score: ['Astronomy', 'Metric System', 'Banking'],
      },
      achievements: ['The Wheel', 'Agriculture', 'Software'],
      decks: {
        usee: {
          5: ['Pen Name'],
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Buried Treasure')
    request = t.choose(game, request, 5)
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'Banking', 'Software', 'Agriculture')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Buried Treasure'],
        score: ['The Wheel', 'Banking', 'Software', 'Agriculture'],
        safe: ['Pen Name'],
      },
      micah: {
        score: ['Metric System'],
      },
    })
  })

})
