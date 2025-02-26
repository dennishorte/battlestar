Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Stephen Hawking', () => {

  test('inspire', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Stephen Hawking'],
      },
      decks: {
        base: {
          10: ['Software', 'Robotics']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.blue')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        blue: ['Stephen Hawking', 'Software'],
        hand: ['Robotics']
      },
    })
  })

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.The Wheel')
    const request3 = t.choose(game, request2, 'blue')

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Stephen Hawking')

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
