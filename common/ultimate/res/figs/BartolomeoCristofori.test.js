Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Bartolomeo Cristofori', () => {
  test('inspire', () => {
    const game = t.fixtureTopCard('Bartolomeo Cristofori', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', ['Construction', 'The Wheel'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.purple')

    t.testChoices(request2, ['Construction', 'The Wheel'])

    const request3 = t.choose(game, request2, 'The Wheel')

    t.testZone(game, 'green', ['The Wheel'])
  })

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Canning')
    const request3 = t.choose(game, request2, 'age 5')

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Canning')

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Canning')

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
