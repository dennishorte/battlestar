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

    t.dumpLog(game)
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
  })

  test('share bonus gained', () => {

  })

  test('no share bonus if only teammate shares', () => {

  })

  test('demands work', () => {
    // See Archery.test.js for an example of a successful demand
  })

})
