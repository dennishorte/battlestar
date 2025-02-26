Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('George Stephenson', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: {
          cards: ['George Stephenson', 'Navigation'],
          splay: 'right',
        },
        purple: {
          cards: ['Lighting', 'Enterprise'],
          splay: 'right'
        },
        yellow: {
          cards: ['Canning', 'Agriculture'],
          splay: 'left'
        }
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.George Stephenson')

    t.testChoices(request2, ['green', 'purple'])

    const request3 = t.choose(game, request2, 'purple')

    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['George Stephenson', 'Navigation'],
          splay: 'right',
        },
        purple: {
          cards: ['Lighting', 'Enterprise'],
          splay: 'up'
        },
        yellow: {
          cards: ['Canning', 'Agriculture'],
          splay: 'left'
        }
      },
    })
  })

  test('karma: claim', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['George Stephenson'],
        purple: ['Lighting'],
        blue: {
          cards: [
            'Bioengineering',
            'Computers',
            'Publications',
            'Rocketry',
            'Quantum Theory'
          ],
          splay: 'up'
        },
        hand: ['Software']
      },
      achievements: ['The Wheel', 'Calendar', 'Coal', 'Composites']
    })
    game.testSetBreakpoint('before-first-player', (game) => {
      game.getZoneByDeck('base', 3).cards().forEach(card => game.mRemove(t.dennis(game), card))
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Software')

    t.testBoard(game, {
      dennis: {
        green: ['George Stephenson'],
        purple: ['Lighting'],
        blue: {
          cards: [
            'Software',
            'Bioengineering',
            'Computers',
            'Publications',
            'Rocketry',
            'Quantum Theory'
          ],
          splay: 'up'
        },
        achievements: ['World']
      }
    })

    const achievements = game
      .getZoneById('achievements')
      .cards()
      .filter(card => !card.isSpecialAchievement)
      .map(card => card.age)
      .sort()

    expect(achievements).toStrictEqual([1,1,2,2,4,5,5,6,7,8,9,9])
  })

})
