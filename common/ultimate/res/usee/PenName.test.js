Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Pen Name', () => {

  test('dogma: splay left', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Pen Name', 'Monotheism'],
        blue: ['Experimentation', 'Tools'],
        hand: ['Translation'],
      },
      decks: {
        usee: {
          5: ['Gallery'],
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Pen Name')
    request = t.choose(game, 'Splay left and self-execute.blue')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Pen Name', 'Monotheism'],
        blue: {
          cards: ['Experimentation', 'Tools'],
          splay: 'left',
        },
        yellow: ['Gallery'],
        hand: ['Translation'],
      },
    })
  })

  test('dogma: meld', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Pen Name', 'Monotheism'],
        blue: ['Experimentation', 'Tools'],
        hand: ['Translation'],
      },
      decks: {
        usee: {
          5: ['Gallery'],
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Pen Name')
    request = t.choose(game, 'Meld and splay right.Translation')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Pen Name', 'Monotheism'],
        blue: {
          cards: ['Translation', 'Experimentation', 'Tools'],
          splay: 'right',
        },
      },
    })
  })

})
