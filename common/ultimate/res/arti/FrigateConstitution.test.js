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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'auto')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        purple: ['Enterprise'],
        museum: ['Museum 1', 'Frigate Constitution'],
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        purple: ['Enterprise'],
        museum: ['Museum 1', 'Frigate Constitution'],
      },
      micah: {
        green: ['Electricity'],
        red: ['Coal', 'Archery'],
      },
    })
  })
})
