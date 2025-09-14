Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Touchscreen", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: {
          cards: ['Coal', 'Coke', 'Industrialization', 'Archery', 'Construction', 'Engineering', 'Flight', 'Gunpowder'],
          splay: 'up',
        },
        yellow: ['Agriculture', 'Masonry', 'Domestication', 'Machinery'],
        green: {
          cards: ['Classification', 'Databases', 'Paper', 'Sailing', 'Navigation', 'Mapmaking'],
          splay: 'left',
        },
        blue: ['Touchscreen', 'Mathematics'],
        purple: {
          cards: ['Astronomy', 'Lighting'],
          splay: 'aslant',
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Touchscreen')

    t.testChoices(request, ['red left', 'yellow up', 'green right', 'blue aslant'])

    request = t.choose(game, request, 'red left')
    request = t.choose(game, request, 'yellow up')
    request = t.choose(game, request, 'green right')


    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Coal', 'Coke', 'Industrialization', 'Archery', 'Construction', 'Engineering', 'Flight', 'Gunpowder'],
          splay: 'left',
        },
        yellow: {
          cards: ['Agriculture', 'Masonry', 'Domestication', 'Machinery'],
          splay: 'up',
        },
        green: {
          cards: ['Classification', 'Databases', 'Paper', 'Sailing', 'Navigation', 'Mapmaking'],
          splay: 'right',
        },
        blue: {
          cards: ['Touchscreen', 'Mathematics'],
          splay: 'aslant',
        },
        purple: {
          cards: ['Astronomy', 'Lighting'],
          splay: 'aslant',
        },
        achievements: ['Empire'],
      },
    })
  })
})
