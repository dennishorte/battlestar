Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Private Eye', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Private Eye'],
        safe: ['Tools'],
      },
      micah: {
        hand: ['Monotheism', 'Mathematics'],
      },
      decks: {
        usee: {
          7: ['Counterintelligence'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Private Eye')
    request = t.choose(game, 'Mathematics')
    request = t.choose(game, 'blue')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: {
          cards: ['Mathematics', 'Private Eye'],
          splay: 'right',
        },
        score: ['Tools'],
      },
      micah: {
        hand: ['Monotheism', 'Counterintelligence'],
      },
    })
  })

})
