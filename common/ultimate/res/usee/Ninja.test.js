Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Ninja', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Ninja', 'Metalworking'],
      },
      micah: {
        blue: ['Mathematics'],
        red: ['Optics'],
        hand: ['Tools', 'Domestication']
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Ninja')
    request = t.choose(game, request, 'blue')
    request = t.choose(game, request, 'red')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Ninja', 'Metalworking'],
          splay: 'right',
        },
        blue: ['Mathematics'],
      },
      micah: {
        red: ['Optics'],
        hand: ['Domestication'],
      },
    })
  })

})
