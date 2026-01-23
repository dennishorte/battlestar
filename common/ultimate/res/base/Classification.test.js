Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Classification', () => {
  test('transfer a card', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: ['Classification'],
        hand: ['Mathematics', 'Code of Laws', 'Alchemy'],
      },
      micah: {
        hand: ['Experimentation', 'Metric System', 'Tools'],
      },
    })
    game.run()
    t.choose(game, 'Dogma.Classification')
    t.choose(game, 'Mathematics')

    t.choose(game, 'Tools')
    t.choose(game, 'Alchemy')
    t.choose(game, 'Mathematics')

    t.testBoard(game, {
      dennis: {
        green: ['Classification'],
        blue: ['Experimentation', 'Mathematics', 'Alchemy', 'Tools'],
        hand: ['Code of Laws'],
      },
      micah: {
        hand: ['Metric System'],
      },
    })
  })

})
