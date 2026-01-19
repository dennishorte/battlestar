Error.stackTraceLimit = 100
import t from '../../testutil.js'
describe('Handshake', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Handshake'],
        hand: ['Domestication', 'Masonry', 'Writing'],
      },
      micah: {
        hand: ['The Wheel', 'Tools']
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Handshake')
    request = t.choose(game, request, 'blue', 'green')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Handshake'],
        hand: ['Writing', 'Tools', 'The Wheel'],
      },
      micah: {
        hand: ['Domestication', 'Masonry'],
      },
    })
  })

})
