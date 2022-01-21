Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Software', () => {
  test('draw and score a 10', () => {
    const game = t.fixtureDogma('Software')
    game.run()
    jest.spyOn(game, 'aDrawAndScore')

    // First card will be scored.
    // Next two will be for draw and meld
    t.topDeck(game, 'base', 10, ['The Internet', 'Globalization', 'Stem Cells'])

    t.dogma(game, 'Software')

    expect(game.aDrawAndScore).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ name: 'micah' }),
      10
    )
  })

  test(`Draw and meld two {0}, then execute each of the second card's non-demand dogma effects. Do not share them.`, () => {
    const game = t.fixtureDogma('Software')
    game.run()

    jest.spyOn(game, 'aDrawAndMeld')
    jest.spyOn(game, 'aExecute')

    // First card will be scored.
    // Next two will be for draw and meld
    t.topDeck(game, 'base', 10, ['The Internet', 'Globalization', 'Stem Cells'])

    t.dogma(game, 'Software')

    expect(game.aDrawAndMeld.mock.calls.length).toBe(2)
    expect(game.aDrawAndMeld.mock.calls[0]).toEqual([
      expect.anything(),
      expect.objectContaining({ name: 'micah' }),
      10
    ])
    expect(game.aDrawAndMeld.mock.calls[1]).toEqual([
      expect.anything(),
      expect.objectContaining({ name: 'micah' }),
      10
    ])

    expect(game.aExecute).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ name: 'micah' }),
      'Stem Cells',
    )
  })
})
