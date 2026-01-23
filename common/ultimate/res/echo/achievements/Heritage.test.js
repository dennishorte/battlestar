Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('Heritage', () => {
  test('eight hexes in one color', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Specialization'],
        blue: [
          'Bioengineering',
          'Software',
          'Computers',
          'Genetics',
          'Quantum Theory',
          'Rocketry',
          'Evolution',
          'Atomic Theory',
        ],
      },
    })

    game.run()
    t.choose(game, 'Dogma.Specialization')
    t.choose(game, 'blue')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Specialization'],
        blue: {
          cards: [
            'Bioengineering',
            'Software',
            'Computers',
            'Genetics',
            'Quantum Theory',
            'Rocketry',
            'Evolution',
            'Atomic Theory',
          ],
          splay: 'up',
        },
        achievements: ['Heritage'],
      },
    })
  })

  test('eight hexes total, but different colors', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Specialization'],
        blue: [
          'Bioengineering',
          'Software',
          'Computers',
          'Quantum Theory',
          'Rocketry',
          'Evolution',
          'Atomic Theory',
        ],
        red: ['Metalworking'],
      },
    })

    game.run()
    t.choose(game, 'Dogma.Specialization')
    t.choose(game, 'blue')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Specialization'],
        blue: {
          cards: [
            'Bioengineering',
            'Software',
            'Computers',
            'Quantum Theory',
            'Rocketry',
            'Evolution',
            'Atomic Theory',
          ],
          splay: 'up',
        },
        red: ['Metalworking'],
      },
    })
  })

  test('seven hexes in one color', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Specialization'],
        blue: [
          'Bioengineering',
          'Software',
          'Computers',
          'Genetics',
          'Quantum Theory',
          'Evolution',
          'Atomic Theory',
        ],
      },
    })

    game.run()
    t.choose(game, 'Dogma.Specialization')
    t.choose(game, 'blue')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Specialization'],
        blue: {
          cards: [
            'Bioengineering',
            'Software',
            'Computers',
            'Genetics',
            'Quantum Theory',
            'Evolution',
            'Atomic Theory',
          ],
          splay: 'up',
        },
      },
    })
  })
})
