Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Flight', () => {
  test('red is not splayed up', () => {
    const game = t.fixtureFirstPicks()
    t.setColor(game, 'micah', 'red', ['Flight', 'Archery'])
    t.setColor(game, 'micah', 'blue', ['Experimentation', 'Writing'])
    game.run()

    jest.spyOn(game, 'aChooseAndSplay')
    t.dogma(game, 'Flight')

    expect(game.aChooseAndSplay).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        playerName: 'micah',
        direction: 'up',
        choices: ['red']
      })
    )
  })

  test('red is splayed up', () => {
    const game = t.fixtureFirstPicks()
    t.setColor(game, 'micah', 'red', ['Flight', 'Archery'])
    t.setColor(game, 'micah', 'blue', ['Experimentation', 'Writing'])

    t.setSplay(game, 'micah', 'red', 'up')

    game.run()

    jest.spyOn(game, 'aChooseAndSplay')
    t.dogma(game, 'Flight')

    expect(game.aChooseAndSplay).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        playerName: 'micah',
        direction: 'up',
      })
    )

  })
})
