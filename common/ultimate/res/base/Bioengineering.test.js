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
    game.run()
    const request = t.choose(game, 'Dogma.Bioengineering')

    expect(request.selectors[0].choices.sort()).toEqual(['Agriculture', 'Clothing', 'Sailing'])

    t.choose(game, 'Sailing')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Bioengineering'],
        green: ['Clothing'],
        score: ['Sailing'],
      },
      micah: {
        yellow: ['Agriculture'],
      },
    })
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

    game.run()
    t.choose(game, 'Dogma.Bioengineering')
    const result = t.choose(game, 'Clothing')

    expect(result).toEqual(expect.any(GameOverEvent))
    t.testGameOver(result, 'dennis', 'Bioengineering')
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
    game.run()
    t.choose(game, 'Dogma.Bioengineering')
    const result = t.choose(game, 'Pottery')

    expect(result).toEqual(expect.any(InputRequestEvent))
    expect(result.selectors[0].actor).toBe('micah')
    expect(result.selectors[0].title).toBe('Choose First Action')
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
    game.run()
    t.choose(game, 'Dogma.Bioengineering')
    const result = t.choose(game, 'Sailing')

    expect(result).toEqual(expect.any(InputRequestEvent))
    expect(result.selectors[0].actor).toBe('micah')
    expect(result.selectors[0].title).toBe('Choose First Action')
  })
})
