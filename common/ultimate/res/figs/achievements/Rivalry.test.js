Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

test('Rivalry', () => {
  const game = t.fixtureDecrees({ numPlayers: 3 })
  t.setBoard(game, {
    micah: {
      score: ['Mathematics', 'Experimentation', 'Coal', 'Software'],
      yellow: ['Sunshu Ao', 'Sneferu'], // Top figures
    },
    scott: {
      yellow: ['Shennong'], // Top figure
    },
  })

  let request
  request = game.run()
  request = t.choose(game, request, 'Decree.Rivalry')
  // choosePlayer creates a request to choose between micah and scott
  request = t.choose(game, request, 'micah')
  request = t.choose(game, request, 'Software', 'Coal', 'Mathematics')
  request = t.choose(game, request, 'auto')

  t.testBoard(game, {
    dennis: {
      achievements: ['Rivalry'], // Rivalry decree was claimed
    },
    micah: {
      score: ['Experimentation'], // Three cards returned: Software, Coal, Mathematics
      yellow: ['Sneferu'], // Sunshu Ao (top figure) was returned
    },
    scott: {
      yellow: ['Shennong'], // Not affected (not chosen)
    },
  })
})
