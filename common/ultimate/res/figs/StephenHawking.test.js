Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Stephen Hawking', () => {


  test('karma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: {
          cards: ['Stephen Hawking', 'Experimentation'],
          splay: 'right'
        },
        green: {
          cards: [
            'The Wheel',  // hkkk
            'Clothing',   // hcll
            'George Stephenson', // 7&fh
            'Mapmaking',  // hcck
            'Currency',   // lchc
          ],
          splay: 'up'
        },
      },
      decks: {
        base: {
          1: ['Sailing', 'Domestication']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.The Wheel')
    request = t.choose(game, request, 'blue')

    t.testBoard(game, {
      dennis: {
        blue: {
          cards: ['Stephen Hawking', 'Experimentation'],
          splay: 'up',
        },
        green: {
          cards: [
            'The Wheel',  // hkkk
            'Clothing',   // hcll
          ],
          splay: 'up'
        },
        score: ['George Stephenson', 'Mapmaking', 'Currency'],
        hand: ['Sailing', 'Domestication'],
      },
    })
  })

  test('karma: more complicated scenario', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Ptolemy'],
        blue: ['Tools', 'Calendar', 'Writing', 'Pottery'],
      },
      micah: {
        blue: {
          cards: ['Stephen Hawking', 'Experimentation', 'Physics'],
          splay: 'right'
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Stephen Hawking')

    t.setBoard(game, {
      dennis: {
        green: ['Ptolemy'],
        blue: ['Tools', 'Calendar', 'Writing', 'Pottery'],
        score: ['Pottery', 'Writing'],
      },
      micah: {
        blue: ['Stephen Hawking'],
        score: ['Experimentation', 'Physics'],
      },
    })
  })
})
