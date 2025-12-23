Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Jackie Chan', () => {

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Achieve.*base-6*')

    t.testGameOver(request, 'micah', 'Jackie Chan')
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Achieve.*base-6*')

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
    t.testGameOver(request, 'dennis', 'achievements')
  })

})
