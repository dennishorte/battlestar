Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Susan Blackmore', () => {
  test('karma: opponent shares, self-execute card', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Experimentation'],
      },
      micah: {
        blue: ['Susan Blackmore'],
      },
      decks: {
        base: {
          5: ['Coal', 'Societies'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Experimentation')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Coal'],
        blue: ['Experimentation'],
      },
      micah: {
        blue: ['Susan Blackmore'],
        purple: ['Societies'],
      },
    })
  })

  test('karma: owner shares, self-execute card', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Susan Blackmore'],
        yellow: ['Agriculture'],
        hand: ['Canning', 'Societies'],
      },
      micah: {
        blue: ['Pottery'],
        hand: ['Sailing'],
      },
      decks: {
        base: {
          2: ['Mathematics'],
          6: ['Metric System'],
          7: ['Lighting'],
        },
        figs: {
          10: ['Stephen Hawking'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Agriculture')
    request = t.choose(game, request, 'Sailing')
    request = t.choose(game, request, 'Canning')
    request = t.choose(game, request, 'Societies')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Susan Blackmore'],
        yellow: ['Agriculture'],
        score: ['Lighting', 'Metric System'],
        hand: ['Stephen Hawking'],
      },
      micah: {
        blue: ['Pottery'],
        score: ['Mathematics'],
      },
    })
  })
})
