Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("GPS", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['GPS'],
        yellow: ['Agriculture', 'Canning'],
      },
      micah: {
        forecast: ['Tools'],
      },
      decks: {
        echo: {
          11: ['Algocracy', 'Esports', 'Streaming'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.GPS')
    request = t.choose(game, 'yellow')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['GPS'],
        yellow: {
          cards: ['Agriculture', 'Canning'],
          splay: 'up'
        },
        hand: ['Algocracy', 'Esports', 'Streaming'],
      },
    })
  })

  test('dogma: forecast', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Agriculture', 'Canning'],
        hand: ['Astrogeology'],
        forecast: ['GPS'],
      },
      micah: {
        forecast: ['Tools'],
      },
      decks: {
        echo: {
          11: ['Algocracy', 'Esports', 'Streaming'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Astrogeology')
    request = t.choose(game, 'yellow')
    request = t.choose(game, 'Esports')
    request = t.choose(game, 'Streaming')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Astrogeology'],
        green: ['GPS'],
        yellow: {
          cards: ['Agriculture', 'Canning'],
          splay: 'up'
        },
        hand: ['Algocracy'],
        forecast: ['Esports', 'Streaming'],
      },
    })
  })
})
