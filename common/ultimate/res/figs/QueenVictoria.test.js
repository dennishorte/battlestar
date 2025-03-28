Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Queen Victoria', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Queen Victoria'],
      },
      micah: {
        score: ['Fu Xi']
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Queen Victoria')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Queen Victoria'],
        score: ['Fu Xi'],
      },
    })
  })

  test('karma: decree', () => {
    t.testDecreeForTwo('Queen Victoria', 'Rivalry')
  })

  test('karma: achieve', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Queen Victoria'],
        score: ['Software'],
      },
      achievements: ['The Wheel', 'Calendar', 'Engineering'],
      decks: {
        figs: {
          1: ['Fu Xi']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Achieve.age 2')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Queen Victoria'],
        achievements: ['Calendar'],
        score: ['Software'],
      },
      micah: {
        hand: ['Fu Xi'],
      },
    })

    const achievements = game
      .getZoneById('achievements')
      .cards()
      .filter(card => !card.isSpecialAchievement)
      .map(card => card.age)
      .sort()
    expect(achievements).toStrictEqual([1,1,3])
  })
})
