Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Space Traffic', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: ['Space Traffic'],
        red: ['Metalworking', 'Road Building', 'Optics', 'Flight', 'Industrialization', 'Oars'],
      },
      decks: {
        base: {
          11: ['Fusion'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Space Traffic')


    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Space Traffic'],
        red: {
          cards: ['Metalworking', 'Road Building', 'Optics', 'Flight', 'Industrialization'],
          splay: 'aslant',
        },
        score: ['Oars', 'Fusion'],
      },
    })
  })

  test('dogma: repeat', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: ['Space Traffic'],
        red: ['Metalworking', 'Road Building', 'Optics', 'Flight', 'Industrialization', 'Oars'],
      },
      micah: {
        score: ['Software', 'Databases'],
      },
      decks: {
        base: {
          11: ['Fusion', 'Hypersonics'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Space Traffic')

    t.testGameOver(request, 'micah', 'Space Traffic')
  })

  test('dogma: you lose', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: ['Space Traffic'],
      },
      decks: {
        base: {
          11: ['Hypersonics'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Space Traffic')

    t.testGameOver(request, 'micah', 'Space Traffic')
  })

})
