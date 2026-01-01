Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Fresh Water', () => {
  test('dogma: splay unsplayed color left (one unsplayed color)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        yellow: ['Fresh Water'],
        red: ['Fire', 'Archery'], // Unsplayed color (needs 2+ cards to splay)
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Fresh Water')
    // Red is the only unsplayed color, so it gets splayed left

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Fresh Water'],
        red: {
          cards: ['Fire', 'Archery'],
          splay: 'left',
        },
      },
    })
  })

  test('dogma: splay unsplayed color left (multiple unsplayed colors, choose one)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        yellow: ['Fresh Water'],
        red: ['Fire', 'Archery'], // Unsplayed (needs 2+ cards to splay)
        blue: ['Curing', 'Tools'], // Unsplayed (needs 2+ cards to splay)
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Fresh Water')
    request = t.choose(game, request, 'blue') // Choose blue to splay

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Fresh Water'],
        red: {
          cards: ['Fire', 'Archery'],
          splay: 'none',
        },
        blue: {
          cards: ['Curing', 'Tools'],
          splay: 'left',
        },
      },
    })
  })

  test('dogma: you lose (all colors already splayed)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        yellow: ['Fresh Water'],
        red: {
          cards: ['Fire', 'Archery'],
          splay: 'left', // Already splayed left
        },
        blue: {
          cards: ['Curing', 'Tools'],
          splay: 'right', // Already splayed
        },
        green: {
          cards: ['Fishing', 'Foraging'],
          splay: 'left', // Already splayed left
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Fresh Water')
    // All colors are already splayed, so no unsplayed color to splay
    // Player loses

    t.testGameOver(request, 'micah', 'Fresh Water') // Micah wins when Dennis loses
  })

  test('dogma: splay unsplayed color left (some colors already splayed)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        yellow: ['Fresh Water'],
        red: {
          cards: ['Fire', 'Archery'],
          splay: 'left', // Already splayed
        },
        blue: ['Curing', 'Tools'], // Unsplayed (needs 2+ cards to splay)
        green: ['Fishing', 'Foraging'], // Unsplayed (needs 2+ cards to splay)
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Fresh Water')
    request = t.choose(game, request, 'green') // Choose green to splay (blue and green are both unsplayed)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Fresh Water'],
        red: {
          cards: ['Fire', 'Archery'],
          splay: 'left',
        },
        blue: {
          cards: ['Curing', 'Tools'],
          splay: 'none',
        },
        green: {
          cards: ['Fishing', 'Foraging'],
          splay: 'left',
        },
      },
    })
  })
})
