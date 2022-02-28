Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Jackie Chan', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Jackie Chan'],
        hand: ['Enterprise', 'Coal']
      },
      decks: {
        base: {
          10: ['Software']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.red')
    const request3 = t.choose(game, request2, 'Coal')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        red: ['Jackie Chan'],
        hand: ['Enterprise', 'Software'],
        score: ['Coal']
      },
    })
  })

  test('karma: win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Alex Trebek'],
        score: ['Software', 'Robotics', 'A.I.'],
        achievements: ['Tools', 'Calendar', 'Engineering', 'Gunpowder', 'Coal', 'Empire']
      },
      micah: {
        red: ['Jackie Chan'],
        score: ['Stem Cells', 'Bioengineering', 'Empiricism']
      },
      achievements: ['Canning']
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Achieve.age 6')

    t.testBoard(game, {
      dennis: {
        score: ['Software', 'Robotics', 'A.I.'],
        achievements: ['Tools', 'Calendar', 'Engineering', 'Gunpowder', 'Coal', 'Canning', 'Empire']
      },
      micah: {
        red: ['Jackie Chan'],
        score: ['Stem Cells', 'Bioengineering', 'Empiricism', 'Alex Trebek']
      },
    })
    t.testGameOver(request2, 'micah', 'Jackie Chan')
  })

  test('karma: lose', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Globalization'],
        score: ['Software', 'Robotics', 'A.I.'],
        achievements: ['Tools', 'Calendar', 'Engineering', 'Gunpowder', 'Coal', 'Empire']
      },
      micah: {
        red: ['Jackie Chan'],
        score: ['Stem Cells', 'Bioengineering', 'Empiricism']
      },
      achievements: ['Canning']
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Achieve.age 6')

    t.testBoard(game, {
      dennis: {
        yellow: ['Globalization'],
        score: ['Software', 'Robotics', 'A.I.'],
        achievements: ['Tools', 'Calendar', 'Engineering', 'Gunpowder', 'Coal', 'Canning', 'Empire']
      },
      micah: {
        red: ['Jackie Chan'],
        score: ['Stem Cells', 'Bioengineering', 'Empiricism']
      },
    })
    t.testGameOver(request2, 'dennis', 'achievements')
  })

})
