Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Florence Nightingale', () => {

  test('inspire', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Archery'],
        yellow: ['Florence Nightingale'],
        hand: ['Mathematics', 'Engineering']
      },
      decks: {
        base: {
          7: ['Lighting']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.yellow')
    const request3 = t.choose(game, request2, 'Engineering')

    t.testBoard(game, {
      dennis: {
        red: ['Archery', 'Engineering'],
        yellow: ['Florence Nightingale'],
        hand: ['Mathematics', 'Lighting']
      },
    })
  })

  test('karma: decree', () => {
    t.testDecreeForTwo('Florence Nightingale', 'Expansion')
  })

  test('karma: score pile', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Vaccination']
      },
      micah: {
        yellow: ['Florence Nightingale'],
        score: ['Mathematics', 'Enterprise']
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Vaccination')

    t.testIsSecondPlayer(request2)

    t.setBoard(game, {
      dennis: {
        yellow: ['Vaccination']
      },
      micah: {
        yellow: ['Florence Nightingale'],
        score: ['Mathematics', 'Enterprise']
      }
    })
  })

  test('karma: score pile (own effect)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Florence Nightingale'],
        purple: ['Education'],
        score: ['Mathematics', 'Enterprise']
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Education')
    const request3 = t.choose(game, request2, 'yes')

    t.setBoard(game, {
      dennis: {
        yellow: ['Florence Nightingale'],
        score: ['Mathematics', 'Enterprise'],
      },
    })
  })

})
