Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Services', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        purple: ['Services'],
        blue: ['Computers', 'Tools'],
        green: ['Metric System'],
        yellow: ['Canning'],
      },
      micah: {
        score: ['Skyscrapers', 'Quantum Theory', 'Atomic Theory']
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Services')
    request = t.choose(game, request, 8)
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'Computers')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Services'],
        blue: ['Tools'],
        green: ['Metric System'],
        yellow: ['Canning'],
        hand: ['Skyscrapers', 'Quantum Theory'],
      },
      micah: {
        hand: ['Computers'],
        score: ['Atomic Theory'],
      }
    })
  })
})
