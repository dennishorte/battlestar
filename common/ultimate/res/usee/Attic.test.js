Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Attic', () => {

  test('dogma: score', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Attic'],
        hand: ['Paper'],
        score: ['Reformation'],
      },
      decks: {
        usee: {
          4: ['El Dorado'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Attic')
    request = t.choose(game, 'Paper')
    request = t.choose(game, 'score')
    request = t.choose(game, 'Paper')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Attic'],
        score: ['Reformation', 'El Dorado'],
      },
    })
  })

  test('dogma: safeguard', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Attic'],
        hand: ['Paper'],
        score: ['Reformation'],
      },
      decks: {
        usee: {
          1: ['Polytheism'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Attic')
    request = t.choose(game, 'Paper')
    request = t.choose(game, 'safeguard')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Attic'],
        score: ['Polytheism'],
        safe: ['Paper'],
      },
    })
  })

})
