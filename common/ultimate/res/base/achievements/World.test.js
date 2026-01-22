Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('World achievement', () => {
  test('12 biscuits', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['Specialization'],
        green: ['Databases'],
        blue: [
          'Software',
          'Bioengineering',
          'Computers',
          'Publications',
          'Rocketry',
          'Quantum Theory'
        ],
      },
    })
    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Specialization')
    request = t.choose(game, 'blue')

    t.testBoard(game, {
      dennis: {
        purple: ['Specialization'],
        green: ['Databases'],
        blue: {
          cards: [
            'Software',
            'Bioengineering',
            'Computers',
            'Publications',
            'Rocketry',
            'Quantum Theory'
          ],
          splay: 'up',
        },
        achievements: ['World'],
      },
    })
  })
})
