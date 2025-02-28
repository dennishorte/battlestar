Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Ludwig Van Beethoven', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Ludwig Van Beethoven'],
        hand: ['Coal', 'Canning']
      },
      decks: {
        base: {
          6: ['Atomic Theory']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.purple')
    const request3 = t.choose(game, request2, 'Canning')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Ludwig Van Beethoven'],
        score: ['Canning'],
        hand: ['Coal', 'Atomic Theory']
      },
    })
  })

  test('karma: decree', () => {
    t.testDecreeForTwo('Ludwig Van Beethoven', 'Rivalry')
  })

  test('karma: score with s', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Ludwig Van Beethoven'],
        hand: ['Writing'],
        score: ['The Wheel', 'Canning']
      },
      decks: {
        base: {
          5: ['Coal', 'Astronomy', 'Banking', 'The Pirate Code'],
          6: ['Atomic Theory']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.purple')
    const request3 = t.choose(game, request2, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Ludwig Van Beethoven'],
        hand: ['Atomic Theory'],
        score: ['Coal', 'Astronomy', 'Banking', 'The Pirate Code']
      },
    })
  })

  test('karma: score without s', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Ludwig Van Beethoven'],
        hand: ['Agriculture'],
        score: ['The Wheel', 'Canning']
      },
      decks: {
        base: {
          6: ['Atomic Theory']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.purple')

    t.testBoard(game, {
      dennis: {
        purple: ['Ludwig Van Beethoven'],
        score: ['The Wheel', 'Canning', 'Agriculture'],
        hand: ['Atomic Theory'],
      },
    })
  })

})
