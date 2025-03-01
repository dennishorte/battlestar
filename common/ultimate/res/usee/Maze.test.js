Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Maze', () => {

  test('dogma: simple yes', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Maze'],
        hand: ['Agriculture'],
      },
      micah: {
        hand: ['Domestication'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Maze')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Maze'],
        hand: ['Agriculture'],
      },
      micah: {
        score: ['Domestication'],
      },
    })
  })

  test('dogma: exchange hands after scoring', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Maze'],
        hand: ['Agriculture', 'The Wheel',],
        score: ['Metalworking'],
      },
      micah: {
        hand: ['Domestication', 'Writing'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Maze')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Maze'],
        hand: ['Agriculture', 'The Wheel',],
        score: ['Writing'],
      },
      micah: {
        score: ['Domestication'],
        hand: ['Metalworking'],
      },
    })
  })

  test('dogma: no cards in hand', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Maze'],
        hand: [],
      },
      micah: {
        hand: ['Domestication'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Maze')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Maze'],
      },
      micah: {
        hand: ['Domestication'],
      },
    })
  })

})
