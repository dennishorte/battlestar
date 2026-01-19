Error.stackTraceLimit = 100
import t from '../../testutil.js'
describe('Astrology', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Astrology', 'Tools',],
        yellow: ['Machinery', 'Agriculture', 'Masonry'],
        purple: ['Monotheism'],
      },
      decks: {
        usee: {
          1: ['Myth'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Astrology')
    request = t.choose(game, request, 'yellow')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Astrology', 'Tools',],
        yellow: {
          cards: ['Machinery', 'Agriculture', 'Masonry'],
          splay: 'left',
        },
        purple: ['Monotheism', 'Myth'],
      },
    })
  })

  test('dogma: do not tuck it', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Astrology', 'Tools',],
        yellow: ['Machinery', 'Agriculture', 'Masonry'],
        purple: ['Monotheism'],
      },
      decks: {
        usee: {
          1: ['Proverb'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Astrology')
    request = t.choose(game, request, 'yellow')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Proverb', 'Astrology', 'Tools',],
        yellow: {
          cards: ['Machinery', 'Agriculture', 'Masonry'],
          splay: 'left',
        },
        purple: ['Monotheism'],
      },
    })
  })

})
