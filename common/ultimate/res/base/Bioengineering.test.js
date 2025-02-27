Error.stackTraceLimit = 100

const t = require('../../testutil.js')
const { GameOverEvent, InputRequestEvent } = require('../../../lib/game.js')

describe('Bioengineering', () => {
  test('score a card', () => {
    const game = t.fixtureTopCard('Bioengineering')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'micah', 'yellow', ['Agriculture'])
      t.setColor(game, 'micah', 'green', ['Sailing'])
      t.setColor(game, 'dennis', 'green', ['Clothing'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Bioengineering')

    expect(result2.selectors[0].choices.sort()).toStrictEqual(['Agriculture', 'Clothing', 'Sailing'])

    const result3 = t.choose(game, result2, 'Sailing')

    expect(t.cards(game, 'score')).toStrictEqual(['Sailing'])
  })

  test('win condition yes', () => {
    const game = t.fixtureTopCard('Bioengineering')
    t.setBoard(game, {
      dennis: {
        yellow: ['Agriculture'],
        green: ['Clothing'],
      },
      micah: {
        green: ['Sailing'],
      },
    })

    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Bioengineering')
    const result3 = t.choose(game, result2, 'Clothing')

    expect(result3).toEqual(expect.any(GameOverEvent))
    expect(result3).toEqual(expect.objectContaining({
      data: expect.objectContaining({
        player: expect.objectContaining({ name: 'dennis' }),
        reason: 'Bioengineering'
      })
    }))
  })

  test('win condition tied', () => {
    const game = t.fixtureTopCard('Bioengineering')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'purple', ['Code of Laws'])
      t.setColor(game, 'micah', 'green', ['Sailing'])
      t.setColor(game, 'micah', 'blue', ['Pottery'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Bioengineering')
    const result3 = t.choose(game, result2, 'Pottery')

    expect(result3).toEqual(expect.any(InputRequestEvent))
    expect(result3.selectors[0].actor).toBe('micah')
    expect(result3.selectors[0].title).toBe('Choose First Action')
  })

  test('win condition no', () => {
    const game = t.fixtureTopCard('Bioengineering')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'yellow', ['Agriculture'])
      t.setColor(game, 'dennis', 'purple', ['Code of Laws'])
      t.setColor(game, 'micah', 'green', ['Sailing'])
      t.setColor(game, 'micah', 'blue', ['Pottery'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Bioengineering')
    const result3 = t.choose(game, result2, 'Sailing')

    expect(result3).toEqual(expect.any(InputRequestEvent))
    expect(result3.selectors[0].actor).toBe('micah')
    expect(result3.selectors[0].title).toBe('Choose First Action')
  })
})
