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
    const result2 = t.choose(game, result1, 'Dogma.Classification')
    const result3 = t.choose(game, result2, 'Mathematics')

    const result4 = t.choose(game, result3, 'Tools')
    const result5 = t.choose(game, result4, 'Alchemy')
    const result6 = t.choose(game, result5, 'Mathematics')

    expect(t.cards(game, 'blue')).toEqual(['Experimentation', 'Mathematics', 'Alchemy', 'Tools'])
  })

})
