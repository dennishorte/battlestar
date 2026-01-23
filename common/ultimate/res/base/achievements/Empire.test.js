Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('Empire Achievement', () => {
  test('achieved', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Coal'],
        blue: ['Experimentation'],
        purple: ['Reformation'],
        green: {
          cards: ['The Wheel', 'Navigation'],
          splay: 'up',
        },
        hand: ['Databases'], // Databases needs to be in hand to meld
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Databases')

    t.testBoard(game, {
      dennis: {
        red: ['Coal'],
        blue: ['Experimentation'],
        purple: ['Reformation'],
        green: {
          cards: ['Databases', 'The Wheel', 'Navigation'],
          splay: 'up',
        },
        achievements: ['Empire'],
      },
    })
  })

  test('person biscuits do not count', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        hand: ['Escapism'],
        red: ['Coal'],
        blue: ['Experimentation'],
        purple: ['Reformation'],
        green: {
          cards: ['The Wheel', 'Navigation'],
          splay: 'up',
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Escapism')

    t.testBoard(game, {
      dennis: {
        red: ['Coal'],
        blue: ['Experimentation'],
        purple: {
          cards: ['Escapism', 'Reformation'],
          splay: 'none',
        },
        green: {
          cards: ['The Wheel', 'Navigation'],
          splay: 'up',
        },
        achievements: [],
      },
    })
  })

  test('not quite', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        hand: ['Bioengineering'],
        red: ['Coal'],
        blue: ['Experimentation'],
        purple: ['Reformation'],
        green: {
          cards: ['The Wheel', 'Navigation'],
          splay: 'up',
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Bioengineering')

    t.testBoard(game, {
      dennis: {
        red: ['Coal'],
        blue: {
          cards: ['Bioengineering', 'Experimentation'],
          splay: 'none',
        },
        purple: ['Reformation'],
        green: {
          cards: ['The Wheel', 'Navigation'],
          splay: 'up',
        },
        achievements: [],
      },
    })
  })
})
