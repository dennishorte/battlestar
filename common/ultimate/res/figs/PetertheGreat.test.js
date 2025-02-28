Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Peter the Great', () => {

  test('inspire (and yellow but no green)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Peter the Great'],
        hand: ['Archery'],
      },
      decks: {
        base: {
          5: ['Astronomy']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.red')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Peter the Great', 'Archery'],
        hand: ['Astronomy'],
      },
    })
  })

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Peter the Great')
    const request3 = t.choose(game, request2, 'auto')

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.red')

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.red')

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
