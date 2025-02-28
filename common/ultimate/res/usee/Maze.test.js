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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Maze')

    t.testIsSecondPlayer(request2)
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Maze')

    t.testIsSecondPlayer(request2)
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Maze')

    t.testIsSecondPlayer(request2)
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
