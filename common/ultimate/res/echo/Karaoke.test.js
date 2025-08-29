Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Karaoke", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Coal'],
        purple: ['Karaoke', 'Code of Laws'],
        hand: ['Canning', 'Mathematics'],
      },
      achievements: ['Atomic Theory'],
      decks: {
        echo: {
          6: ['Loom'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Karaoke')
    request = t.choose(game, request, 6)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Loom'],
        purple: ['Karaoke'],
        hand: ['Canning', 'Mathematics', 'Code of Laws', 'Coal'],
        achievements: ['Atomic Theory'],
      },
    })
  })
})
