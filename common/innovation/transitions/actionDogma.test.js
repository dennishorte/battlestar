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

  test('share bonus gained', () => {
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
    const game = t.fixtureDogma('Domestication', { numPlayers: 4, teams: true })
    game.run()

    // Ensure we should share with exactly eliya (micah's teammate)
    const micahBiscuits = game.getBiscuits('micah').final.k
    expect(game.getBiscuits('eliya').final.k).toBeGreaterThanOrEqual(micahBiscuits)
    expect(game.getBiscuits('dennis').final.k).toBeLessThan(micahBiscuits)
    expect(game.getBiscuits('tom').final.k).toBeLessThan(micahBiscuits)

    jest.spyOn(game, 'aDraw')
    jest.spyOn(game, 'aDrawShareBonus')
    t.dogma(game, 'Domestication')

    // Ensure it was shared with Eliya
    expect(game.aDraw).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ name: 'micah' }),
      1
    )
    expect(game.aDraw).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ name: 'eliya' }),
      1
    )

    // Ensure no share bonus was drawn
    expect(game.aDrawShareBonus).not.toHaveBeenCalled()
  })

  test('no share bonus from demands', () => {

  })

  test('demands work', () => {
    // See Archery.test.js for an example of a successful demand
  })

  test('demands are not made of teammates', () => {

  })

})
