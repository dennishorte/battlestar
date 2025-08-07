Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe(`April Fool's Day`, () => {

  test('dogma: claim folklore', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: [`April Fool's Day`],
      },
      achievements: ['Folklore'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, `Dogma.April Fool's Day`)
    request = t.choose(game, request, 'yellow')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: [`April Fool's Day`],
        achievements: ['Folklore'],
      },
    })
  })

  test('dogma: transfer card', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: [`April Fool's Day`, 'Masonry'],
        purple: {
          cards: ['Monotheism', 'Mysticism'],
          splay: 'left',
        },
        hand: ['Domestication'],
      },
      achievements: ['Folklore'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, `Dogma.April Fool's Day`)
    request = t.choose(game, request, 'yellow')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: {
          cards: [`April Fool's Day`, 'Masonry'],
          splay: 'right',
        },
        purple: ['Monotheism', 'Mysticism'],
      },
      micah: {
        yellow: ['Domestication'],
      },
    })
  })

})
