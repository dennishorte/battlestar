Error.stackTraceLimit = 100

const t = require('../testutil.js')

describe('action-decree', () => {

  describe('another player already has the decree', () => {
    test('the decree is returned to the available achievements', () => {
      const game = t.fixtureDecrees({ expansions: ['base', 'figs'] })
      t.getAchievement(game, 'tom', 'Advancement')
      game.run()
      jest.spyOn(game, 'aClaimAchievement')
      t.decree(game, 'Advancement')

      expect(game.aClaimAchievement).not.toHaveBeenCalled()
      expect(game.getZoneByCard('Advancement').name).toBe('achievements')
    })

    test('the decree effects do not happen', () => {
      const game = t.fixtureDecrees({ expansions: ['base', 'figs'] })
      t.getAchievement(game, 'tom', 'Advancement')
      game.run()
      jest.spyOn(game, 'aClaimAchievement')
      t.decree(game, 'Advancement')

      expect(game.getHand('micah').cards.length).toBe(0)
    })
  })

  describe('first claiming the decree', () => {
    test('you achieve the decree', () => {
      const game = t.fixtureDecrees({ expansions: ['base', 'figs'] })
      game.run()
      jest.spyOn(game, 'aClaimAchievement')
      t.decree(game, 'Advancement')

      expect(game.aClaimAchievement).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ name: 'micah' }),
        'Advancement'
      )
    })

    test('you gain the decree effects', () => {
      const game = t.fixtureDecrees({ expansions: ['base', 'figs'] })
      game.run()
      jest.spyOn(game, 'aDraw')
      t.decree(game, 'Advancement')

      expect(game.aDraw).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ name: 'micah' }),
        3
      )
    })
  })

  describe('you already have the decree', () => {
    test('you do not triggere achieve', () => {
      const game = t.fixtureDecrees({ expansions: ['base', 'figs'] })
      t.getAchievement(game, 'micah', 'Advancement')
      game.run()
      jest.spyOn(game, 'aClaimAchievement')
      t.decree(game, 'Advancement')

      expect(game.aClaimAchievement).not.toHaveBeenCalled()
    })

    test('you gain the decree effects', () => {
      const game = t.fixtureDecrees({ expansions: ['base', 'figs'] })
      t.getAchievement(game, 'micah', 'Advancement')
      game.run()
      jest.spyOn(game, 'aDraw')
      t.decree(game, 'Advancement')

      expect(game.aDraw).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ name: 'micah' }),
        3
      )
    })
  })

  test('all cards removed from hand', () => {
    const game = t.fixtureDecrees({ expansions: ['base', 'figs'] })
    const newHand = [...game.getHand('micah').cards]
    newHand.push('Construction')
    newHand.push('Philosophy')
    t.setHand(game, 'micah', newHand)

    expect(game.getHand('micah').cards.length).toBe(7)

    game.run()
    jest.spyOn(game, 'aRemove')
    t.decree(game, 'Advancement')

    expect(game.aRemove.mock.calls.length).toBe(7)
    expect(game.getHand('micah').cards.length).toBe(1)
  })

  describe('decree effects', () => {
    // See tests for individual card files in res/figs/achievements/
  })

})
