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
    const result1 = game.run()
    const result2 = t.choose(game, 'Dogma.Classification')
    const result3 = t.choose(game, 'Mathematics')

    const result4 = t.choose(game, 'Tools')
    const result5 = t.choose(game, 'Alchemy')
    const result6 = t.choose(game, 'Mathematics')

    expect(t.cards(game, 'blue')).toEqual(['Experimentation', 'Mathematics', 'Alchemy', 'Tools'])
  })

})
