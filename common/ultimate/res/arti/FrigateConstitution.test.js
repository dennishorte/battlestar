Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Frigate Constitution', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Frigate Constitution'],
        purple: ['Enterprise'],
      },
      micah: {
        green: ['Electricity'],
        red: ['Coal', 'Archery'],
        hand: ['Gunpowder'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'auto')

    t.testIsFirstAction(request3)
    t.testBoard(game, {
      dennis: {
        purple: ['Enterprise'],
      },
      micah: {
        green: ['Electricity'],
      },
    })
  })

  test('dogma: no cards in hand', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Frigate Constitution'],
        purple: ['Enterprise'],
      },
      micah: {
        green: ['Electricity'],
        red: ['Coal', 'Archery'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        purple: ['Enterprise'],
      },
      micah: {
        green: ['Electricity'],
        red: ['Coal', 'Archery'],
      },
    })
  })
})
