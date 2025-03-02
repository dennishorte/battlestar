Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Rumor', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Rumor'],
        hand: ['Domestication'],
        score: ['Machinery', 'The Wheel'],
      },
      decks: {
        usee: {
          4: ['Ninja'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Rumor')
    request = t.choose(game, request, 'Machinery')
    request = t.choose(game, request, 'Domestication')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Rumor'],
        hand: ['Ninja'],
        score: ['The Wheel'],
      },
      micah: {
        hand: ['Domestication'],
      },
    })
  })

  test('dogma: empty score pile', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Rumor'],
        hand: ['Domestication'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Rumor')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Rumor'],
      },
      micah: {
        hand: ['Domestication'],
      },
    })
  })

})
