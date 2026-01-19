Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("Pagoda", () => {

  test('dogma: tuck a matching card', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Pagoda'],
        red: ['Construction'],
        hand: ['Plumbing'],
      },
      decks: {
        base: {
          3: ['Engineering'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Pagoda')
    request = t.choose(game, request, 'Plumbing')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Pagoda'],
        red: ['Construction', 'Plumbing'],
        hand: ['Engineering'],
      },
    })
  })

  test('dogma: was foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        hand: ['Plumbing', 'Construction'],
        forecast: ['Pagoda'],
      },
      micah: {
        red: ['Coal', 'Optics'],
        green: ['Paper'],
      },
      decks: {
        base: {
          3: ['Engineering'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Construction')
    request = t.choose(game, request, 'Plumbing')
    request = t.choose(game, request, 'Optics')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Pagoda'],
        red: ['Coal', 'Optics', 'Construction', 'Plumbing'],
        hand: ['Engineering'],
      },
      micah: {
        green: ['Paper'],
      },
    })
  })

  test('dogma: no match', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Pagoda'],
        red: ['Construction'],
        hand: ['Lever'],
      },
      decks: {
        base: {
          3: ['Engineering'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Pagoda')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Pagoda'],
        red: ['Construction'],
        hand: ['Lever', 'Engineering'],
      },
    })
  })
})
