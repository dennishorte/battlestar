Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Sunshu Ao', () => {

  test('karma: meld non-figure', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Sunshu Ao'],
        hand: ['Domestication', 'Clothing'],
      },
      decks: {
        base: {
          1: ['Tools']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Domestication')
    request = t.choose(game, request, 'Clothing')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Sunshu Ao'],
        green: ['Clothing'],
        hand: ['Domestication', 'Tools'],
      },
    })
  })

  test('karma: meld, non-action', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Sunshu Ao'],
        blue: ['Experimentation'],
      },
      decks: {
        base: {
          5: ['Societies'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Experimentation')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Sunshu Ao'],
        blue: ['Experimentation'],
        purple: ['Societies'],
      },
    })
  })

  test('karma: meld figure', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Sunshu Ao'],
        hand: ['Shennong'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Shennong')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Shennong', 'Sunshu Ao'],
      },
    })
  })

  test('karma: tuck', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {},
      micah: {
        yellow: {
          cards: ['Sunshu Ao', 'Domestication'],
          splay: 'right',
        },
        green: {
          cards: ['Paper', 'Corporations'],
          splay: 'right',
        },
        purple: {
          cards: ['Reformation', 'Monotheism', 'Mysticism'],
          splay: 'right',
        },
        hand: ['Tools', 'Coal', 'Societies', 'Industrialization', 'Databases', 'Computers'],
      },
      decks: {
        base: {
          1: ['Agriculture', 'Metalworking'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Draw.draw a card')
    request = t.choose(game, request, 'Dogma.Reformation')
    request = t.choose(game, request, 'yes')
    request = t.choose(game, request, 'Tools', 'Coal', 'Databases')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'Dogma.Reformation')
    request = t.choose(game, request, 'yes')
    request = t.choose(game, request, 'auto')

    t.testBoard(game, {
      dennis: {
        hand: ['Agriculture'],
      },
      micah: {
        red: ['Coal', 'Industrialization'],
        yellow: {
          cards: ['Sunshu Ao', 'Domestication'],
          splay: 'right',
        },
        green: {
          cards: ['Paper', 'Corporations', 'Databases'],
          splay: 'right',
        },
        blue: ['Tools', 'Computers'],
        purple: {
          cards: ['Reformation', 'Monotheism', 'Mysticism', 'Societies'],
          splay: 'right',
        },
        achievements: ['Metalworking'],
      }
    })
  })

  test('karma: score', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Sunshu Ao'],
        green: ['Databases', 'Paper', 'Corporations', 'Mapmaking', 'Sailing', 'Navigation'],
        blue: ['Genetics'],
      },
      decks: {
        base: {
          1: ['Tools'],
          11: ['Hypersonics'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Genetics')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Sunshu Ao'],
        green: ['Hypersonics'],
        blue: ['Genetics'],
        score: ['Databases', 'Paper', 'Corporations', 'Mapmaking', 'Sailing', 'Navigation'],
        achievements: ['Tools'],
      },
    })
  })
})
