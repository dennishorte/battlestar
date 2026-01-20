Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Tanning', () => {
  test('dogma: score two cards from hand', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        purple: ['Tanning'],
        hand: ['Fire', 'Curing', 'Fishing'], // Three cards in hand
        score: ['Archery'], // Card in score for second effect
      },
      micah: {
        red: ['Construction', 'Stone Knives'],
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Tanning')
    // First effect: score two cards from hand
    // chooseAndScore with count: 2 requires selecting 2 cards at once
    request = t.choose(game, request, 'Fire', 'Curing') // Choose two cards to score
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'Archery')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Stone Knives'],
        purple: ['Tanning'],
        score: ['Fire', 'Curing'], // Two cards scored
        hand: ['Fishing'], // One card remains in hand
      },
      micah: {
        red: ['Archery', 'Construction'],
      },
    })
  })
})
