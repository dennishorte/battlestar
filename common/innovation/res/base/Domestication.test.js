Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Domestication', () => {
  test('auto-meld single card and draw a 1', () => {
    const game = t.fixtureDogma('Domestication')
    game.run()
    jest.spyOn(game, 'aMeld')
    jest.spyOn(game, 'aDraw')
    t.dogma(game, 'Domestication')
    expect(game.getWaiting('tom').name).toBe('Action (1 of 2)')
    expect(game.aMeld).toHaveBeenCalledWith(expect.anything(), expect.anything(), 'Writing')
    expect(game.aDraw).toHaveBeenCalledWith(expect.anything(), expect.anything(), 1)
  })

  test('no card to meld still draws a card', () => {
    const game = t.fixtureDogma('Domestication')
    t.setHand(game, 'micah', [])
    game.run()
    jest.spyOn(game, 'aMeld')
    jest.spyOn(game, 'aDraw')
    t.dogma(game, 'Domestication')
    expect(game.getWaiting('tom').name).toBe('Action (1 of 2)')
    expect(game.aMeld).not.toHaveBeenCalled()
    expect(game.aDraw).toHaveBeenCalledWith(expect.anything(), expect.anything(), 1)
  })
})
