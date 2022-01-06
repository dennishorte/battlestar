Error.stackTraceLimit = 100

const t = require('../testutil.js')

describe('action-dogma', () => {

  test('effects share', () => {
    const game = t.fixtureDogma('Domestication')
    t.setColor(game, 'dennis', 'green', ['The Wheel'])
    game.run()
    jest.spyOn(game, 'aMeld')
    jest.spyOn(game, 'aDraw')
    t.dogma(game, 'Domestication')

    expect(game.aMeld).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ name: 'micah' }),
      'Writing'
    )
    expect(game.aMeld).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ name: 'dennis' }),
      'Archery'
    )
    expect(game.aMeld).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ name: 'tom' }),
      expect.anything(),
    )

    expect(game.aDraw).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ name: 'micah' }),
      1
    )
    expect(game.aDraw).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ name: 'dennis' }),
      1
    )
    expect(game.aDraw).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ name: 'tom' }),
      expect.anything(),
    )
  })

  test.only('share bonus gained', () => {
    const game = t.fixtureDogma('Domestication')
    t.setColor(game, 'dennis', 'green', ['The Wheel'])
    game.run()
    jest.spyOn(game, 'aDrawShareBonus')
    t.dogma(game, 'Domestication')
    expect(game.aDrawShareBonus).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ name: 'micah' })
    )
  })

  test('no share bonus if only teammate shares', () => {

  })

  test('demands work', () => {
    // See Archery.test.js for an example of a successful demand
  })

})
