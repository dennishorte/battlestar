Error.stackTraceLimit = 100

const t = require('../../testutil.js')
const { GameOverEvent, InputRequestEvent } = require('../../../lib/game.js')

describe('Bioengineering', () => {
  test('score a card', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Bioengineering'],
        green: ['Clothing'],
      },
      micah: {
        yellow: ['Agriculture'],
        green: ['Sailing'],
      },
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Bioengineering')

    expect(result2.selectors[0].choices.sort()).toEqual(['Agriculture', 'Clothing', 'Sailing'])

    const result3 = t.choose(game, result2, 'Sailing')

    expect(t.cards(game, 'score')).toEqual(['Sailing'])
  })

  test('win condition yes', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Bioengineering'],
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
    t.testGameOver(result3, 'dennis', 'Bioengineering')
  })

  test('win condition tied', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Bioengineering'],
        purple: ['Code of Laws'],
      },
      micah: {
        green: ['Sailing'],
        blue: ['Pottery'],
      },
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Bioengineering')
    const result3 = t.choose(game, result2, 'Pottery')

    expect(result3).toEqual(expect.any(InputRequestEvent))
    expect(result3.selectors[0].actor).toBe('micah')
    expect(result3.selectors[0].title).toBe('Choose First Action')
  })

  test('win condition no', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Bioengineering'],
        yellow: ['Agriculture'],
        purple: ['Code of Laws'],
      },
      micah: {
        green: ['Sailing'],
        blue: ['Pottery'],
      },
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Bioengineering')
    const result3 = t.choose(game, result2, 'Sailing')

    expect(result3).toEqual(expect.any(InputRequestEvent))
    expect(result3.selectors[0].actor).toBe('micah')
    expect(result3.selectors[0].title).toBe('Choose First Action')
  })
})
