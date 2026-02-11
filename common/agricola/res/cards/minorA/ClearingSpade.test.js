const t = require('../../../testutil_v2.js')

describe('Clearing Spade', () => {
  function respondAnytimeAction(game, anytimeAction) {
    const request = game.waiting
    const selector = request.selectors[0]
    return game.respondToInputRequest({
      actor: selector.actor,
      title: selector.title,
      selection: { action: 'anytime-action', anytimeAction },
    })
  }

  test('basic crop move during a turn', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Day Laborer', 'Forest', 'Grain Seeds', 'Clay Pit'],
      dennis: {
        minorImprovements: ['clearing-spade-a071'],
        food: 10,
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 3 },
            { row: 2, col: 1 },
          ],
        },
      },
      micah: {
        food: 10,
      },
    })
    game.run()

    // Dennis gets action prompt — use crop move anytime action first
    respondAnytimeAction(game, {
      type: 'crop-move',
      cardName: 'Clearing Spade',
      description: 'Clearing Spade: Move 1 crop to empty field',
    })

    // Pick source field
    t.choose(game, '2,0 (grain x3)')
    // Pick target field
    t.choose(game, '2,1')

    // Dennis's action prompt returns; now choose action
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest') // micah
    t.choose(game, 'Grain Seeds') // dennis
    t.choose(game, 'Clay Pit') // micah

    t.testBoard(game, {
      dennis: {
        food: 12, // 10 + 2 from Day Laborer
        grain: 1, // from Grain Seeds
        minorImprovements: ['clearing-spade-a071'],
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 2 },
            { row: 2, col: 1, crop: 'grain', cropCount: 1 },
          ],
        },
      },
    })
  })

  test('crop move before harvest for extra yield', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 4, // first harvest
      dennis: {
        minorImprovements: ['clearing-spade-a071'],
        food: 10,
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 3 },
            { row: 2, col: 1 },
          ],
        },
      },
      micah: {
        food: 10,
      },
    })
    game.run()

    // Round 4: 4 actions
    t.choose(game, 'Day Laborer') // dennis: +2 food
    t.choose(game, 'Forest') // micah
    t.choose(game, 'Grain Seeds') // dennis: +1 grain
    t.choose(game, 'Clay Pit') // micah

    // Harvest field phase: dennis gets pre-harvest prompt with anytime actions
    // Use crop move before harvest
    respondAnytimeAction(game, {
      type: 'crop-move',
      cardName: 'Clearing Spade',
      description: 'Clearing Spade: Move 1 crop to empty field',
    })
    t.choose(game, '2,0 (grain x3)')
    t.choose(game, '2,1')

    // After crop move, no more crop-move available (no empty target),
    // so "Harvest crops" is auto-responded. Feeding also auto-proceeds
    // since dennis has enough food and no anytime actions.

    // Harvest: field (2,0) had 3→2 grain, harvest 1 → 1 left
    // Harvest: field (2,1) had 0→1 grain, harvest 1 → 0 left
    // Total grain harvested: 2 (instead of 1 without the move!)

    t.testBoard(game, {
      dennis: {
        food: 8, // 10 + 2(DL) - 4(feed)
        grain: 3, // 0 + 1(Grain Seeds) + 2(harvest)
        minorImprovements: ['clearing-spade-a071'],
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 1 },
            { row: 2, col: 1 }, // harvested back to empty
          ],
        },
      },
    })
  })

  test('not available when no source field has 2+ crops', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['clearing-spade-a071'],
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 1 },
            { row: 2, col: 1 },
          ],
        },
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.type === 'crop-move')).toBe(false)
  })

  test('not available when no empty target field', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['clearing-spade-a071'],
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 3 },
            { row: 2, col: 1, crop: 'vegetables', cropCount: 1 },
          ],
        },
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.type === 'crop-move')).toBe(false)
  })
})
