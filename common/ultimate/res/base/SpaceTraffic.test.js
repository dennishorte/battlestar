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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Space Traffic')


    t.testIsSecondPlayer(request2)
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Space Traffic')

    t.testGameOver(request2, 'micah', 'Space Traffic')
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Space Traffic')

    t.testGameOver(request2, 'micah', 'Space Traffic')
  })

})
