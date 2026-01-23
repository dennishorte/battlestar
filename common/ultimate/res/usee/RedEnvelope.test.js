Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Red Envelope', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Red Envelope'],
        hand: ['Optics', 'Masonry', 'Sailing', 'Domestication'],
        score: ['Machinery', 'Tools']
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Red Envelope')
    request = t.choose(game, 'auto')
    request = t.choose(game, 'yes')
    request = t.choose(game, 'Masonry', 'Sailing')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Red Envelope'],
        hand: ['Domestication'],
        score: ['Masonry', 'Sailing', 'Tools'],
      },
      micah: {
        score: ['Machinery', 'Optics']
      },
    })
  })

  test('dogma: only one card in hand', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Red Envelope'],
        hand: ['Optics', 'Domestication'],
        score: ['Machinery']
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Red Envelope')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Red Envelope'],
        hand: ['Domestication'],
        score: [],
      },
      micah: {
        score: ['Machinery', 'Optics']
      },
    })
  })

})
