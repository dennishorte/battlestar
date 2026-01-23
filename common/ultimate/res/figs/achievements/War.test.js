const t = require('../../../testutil.js')

test('War', () => {
  const game = t.fixtureDecrees({ numPlayers: 3 })
  game.testSetBreakpoint('before-first-player', (game) => {
    t.setColor(game, 'dennis', 'purple', ['Education'])
    t.setColor(game, 'micah', 'yellow', ['Machinery', 'Medicine'])
    t.setColor(game, 'micah', 'blue', ['Mathematics', 'Alchemy'])
    t.setColor(game, 'scott', 'red', ['Optics'])
    t.setColor(game, 'scott', 'green', ['Databases'])
  })

  game.run()
  t.choose(game, 'Decree.War')
  t.choose(game, 3) // Choose age 3 - returns Machinery (micah's yellow) and Optics (scott's red)
  t.choose(game, 'auto')

  t.testIsSecondPlayer(game)
  t.testBoard(game, {
    dennis: {
      purple: ['Education'],
      achievements: ['War'], // Decree claimed as achievement
    },
    micah: {
      yellow: ['Medicine'], // Machinery returned (was age 3)
      blue: ['Mathematics', 'Alchemy'],
    },
    scott: {
      red: [], // Optics returned (was age 3)
      green: ['Databases'],
    },
  })
})
