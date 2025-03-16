Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Peter the Great', () => {


  test('karma: when-meld', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Avicenna'],
        hand: ['Peter the Great'],
      },
      micah: {
        purple: ['Homer'],
        red: ['Nelson Mandela'],
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Peter the Great')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Peter the Great'],
        yellow: ['Avicenna'],
      },
    })

  })

  test('karma: achieve bottom green', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Peter the Great'],
        green: ['Navigation', 'Sailing'],
        hand: ['Canning'],
        score: ['Coal'],
      },
      decks: {
        base: {
          5: ['Astronomy']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.red')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Peter the Great'],
        green: ['Navigation'],
        yellow: ['Canning'],
        hand: ['Astronomy'],
        score: ['Coal'],
        achievements: ['Sailing'],
      },
    })
  })

  test('karma: score bottom green', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Peter the Great'],
        green: ['Navigation', 'Mapmaking'],
        hand: ['Canning'],
      },
      decks: {
        base: {
          5: ['Astronomy']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.red')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Peter the Great'],
        green: ['Navigation'],
        yellow: ['Canning'],
        hand: ['Astronomy'],
        score: ['Mapmaking'],
      },
    })
  })
})
