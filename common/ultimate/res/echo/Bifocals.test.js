Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Bifocals", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Industrialization'],
        blue: ['Bifocals', 'Tools'],
        green: ['Paper', 'Sailing'],
        forecast: ['Canning'],
      },
      decks: {
        base: {
          2: ['Calendar'],
          7: ['Lighting'],
        },
      },
      achievements: ['Construction', 'Machinery'],
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Bifocals')
    request = t.choose(game, 'green')
    request = t.choose(game, 'blue')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Industrialization'],
        blue: {
          cards: ['Bifocals', 'Tools'],
          splay: 'up',
        },
        green: {
          cards: ['Paper', 'Sailing'],
          splay: 'right'
        },
        forecast: ['Lighting'],
      },
    })
  })

  test('dogma: foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Tools'],
        green: ['Paper', 'Sailing'],
        hand: ['Industrialization'],
        forecast: ['Canning', 'Bifocals'],
      },
      decks: {
        base: {
          2: ['Calendar'],
          7: ['Lighting'],
        },
      },
      achievements: ['Construction', 'Machinery'],
    })

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Industrialization')
    request = t.choose(game, 'Bifocals')
    request = t.choose(game, 'green')
    request = t.choose(game, 'blue')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Industrialization'],
        blue: {
          cards: ['Bifocals', 'Tools'],
          splay: 'up',
        },
        green: {
          cards: ['Paper', 'Sailing'],
          splay: 'right'
        },
        forecast: ['Lighting', 'Calendar'],
      },
    })
  })
})
