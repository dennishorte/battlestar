Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Espionage', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Espionage'],
        hand: ['Sailing'],
      },
      micah: {
        hand: ['The Wheel', 'Domestication', 'Tools'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Espionage')
    request = t.choose(game, 'Tools')
    request = t.choose(game, 'The Wheel')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Espionage'],
        hand: ['Sailing', 'Tools'],
      },
      micah: {
        hand: ['The Wheel', 'Domestication'],
      },
    })
  })

})
