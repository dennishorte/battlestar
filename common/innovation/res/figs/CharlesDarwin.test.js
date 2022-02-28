Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Charles Darwin', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Charles Darwin'],
      },
      decks: {
        base: {
          8: ['Quantum Theory']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Charles Darwin')

    t.testBoard(game, {
      dennis: {
        blue: ['Charles Darwin'],
        hand: ['Quantum Theory'],
      },
    })
  })

  test('karma: decree', () => {
    t.testDecreeForTwo('Charles Darwin', 'Advancement')
  })

  test('karma: win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Charles Darwin'],
        score: ['Machine Tools'],
        achievements: ['Empire'],
      },
      achievements: ['The Wheel']
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Achieve.age 1')

    t.testGameOver(request2, 'dennis', 'Charles Darwin')
  })

  test('karma: do not win (tied)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Charles Darwin'],
        score: ['Machine Tools'],
      },
      achievements: ['The Wheel'],
      decks: {
        figs: {
          1: ['Fu Xi']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Achieve.age 1')

    t.testBoard(game, {
      dennis: {
        blue: ['Charles Darwin'],
        score: ['Machine Tools'],
        achievements: ['The Wheel'],
      },
      micah: {
        hand: ['Fu Xi']
      }
    })
  })
})
