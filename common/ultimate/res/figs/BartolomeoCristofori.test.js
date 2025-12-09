Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Bartolomeo Cristofori', () => {

  test('karma fifth card', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        hand: ['Canning'],
        purple: ['Bartolomeo Cristofori'],
        yellow: {
          cards: ['Steam Engine', 'Statistics', 'Anatomy', 'Perspective'],
          splay: 'left'
        },
        score: ['Astronomy']
      },
      achievements: ['The Wheel', 'Enterprise', 'The Pirate Code', 'Vaccination', 'Lighting'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Canning')
    request = t.choose(game, request, '**base-5*')

    t.testBoard(game, {
      dennis: {
        hand: [],
        purple: ['Bartolomeo Cristofori'],
        yellow: {
          cards: ['Canning', 'Steam Engine', 'Statistics', 'Anatomy', 'Perspective'],
          splay: 'left'
        },
        score: ['Astronomy'],
        achievements: ['The Pirate Code'],
      },
    })
  })

  test('karma fourth card', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        hand: ['Canning'],
        purple: ['Bartolomeo Cristofori'],
        yellow: {
          cards: ['Steam Engine', 'Statistics', 'Anatomy'],
          splay: 'left'
        },
        score: ['Astronomy']
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Canning')

    t.testBoard(game, {
      dennis: {
        hand: [],
        purple: ['Bartolomeo Cristofori'],
        yellow: {
          cards: ['Canning', 'Steam Engine', 'Statistics', 'Anatomy'],
          splay: 'left'
        },
        score: ['Astronomy'],
        achievements: [],
      },
    })
  })

  test('karma sixth card', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        hand: ['Canning'],
        purple: ['Bartolomeo Cristofori'],
        yellow: {
          cards: ['Steam Engine', 'Statistics', 'Anatomy', 'Domestication', 'Agriculture'],
          splay: 'left'
        },
        score: ['Astronomy']
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Canning')

    t.testBoard(game, {
      dennis: {
        hand: [],
        purple: ['Bartolomeo Cristofori'],
        yellow: {
          cards: ['Canning', 'Steam Engine', 'Statistics', 'Anatomy', 'Domestication', 'Agriculture'],
          splay: 'left'
        },
        score: ['Astronomy'],
        achievements: [],
      },
    })
  })

})
