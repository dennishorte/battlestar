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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Charles Darwin')

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Achieve.age 1')

    t.testGameOver(request, 'dennis', 'Charles Darwin')
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Achieve.age 1')

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
