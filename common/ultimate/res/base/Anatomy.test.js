Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Anatomy', () => {
  test('returned, matching top card', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Anatomy'],
      },
      micah: {
        score: ['Mathematics', 'The Wheel'],
        red: ['Archery'],
        blue: ['Calendar'],
      },
    })
    const result1 = game.run()
    const result2 = t.choose(game, 'Dogma.Anatomy')
    const result3 = t.choose(game, 'The Wheel') // Micah's choice

    expect(t.cards(game, 'score', 'micah')).toEqual(['Mathematics'])
    expect(t.cards(game, 'red', 'micah')).toEqual([])
    expect(t.cards(game, 'blue', 'micah')).toEqual(['Calendar'])
  })

  test('returned, no matching top card', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Anatomy'],
      },
      micah: {
        score: ['Mathematics', 'The Wheel'],
        red: ['Gunpowder', 'Archery'],
        blue: ['Calendar'],
      },
    })
    const result1 = game.run()
    const result2 = t.choose(game, 'Dogma.Anatomy')
    const result3 = t.choose(game, 'The Wheel') // Micah's choice

    expect(t.cards(game, 'score', 'micah')).toEqual(['Mathematics'])
    expect(t.cards(game, 'red', 'micah')).toEqual(['Gunpowder', 'Archery'])
    expect(t.cards(game, 'blue', 'micah')).toEqual(['Calendar'])
  })

  test('did not return', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Anatomy'],
      },
      micah: {
        red: ['Archery'],
        blue: ['Calendar'],
      },
    })
    const result1 = game.run()
    const result2 = t.choose(game, 'Dogma.Anatomy')

    expect(t.cards(game, 'red', 'micah')).toEqual(['Archery'])
    expect(t.cards(game, 'blue', 'micah')).toEqual(['Calendar'])
    expect(result2.selectors[0].title).toBe('Choose First Action')
  })
})
